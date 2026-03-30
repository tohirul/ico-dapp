// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

/* ───────────────── IMPORTS ───────────────── */

import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

/* ───────────────── INTERFACES ───────────────── */

interface INFTBoost {
    function getBoost(address user) external view returns (uint256);
}

/* ───────────────── CONTRACT ───────────────── */

contract Staking is AccessControl, ReentrancyGuard, Pausable {
    using SafeERC20 for IERC20;

    /* ───────────────── ROLES ───────────────── */

    bytes32 public constant OPERATOR_ROLE = keccak256("OPERATOR_ROLE");
    bytes32 public constant ALLOCATOR_ROLE = keccak256("ALLOCATOR_ROLE");

    /* ───────────────── TOKENS ───────────────── */

    IERC20 public immutable stakingToken;
    IERC20 public immutable rewardToken;

    /* ───────────────── GLOBAL STATE ───────────────── */

    uint256 public rewardRate;              // tokens per second
    uint256 public lastUpdateTime;
    uint256 public accRewardPerShare;

    uint256 public totalStaked;

    uint256 public totalFunded;
    uint256 public totalDistributed;

    uint256 public constant PRECISION = 1e12;

    /* ───────────────── BOOST ───────────────── */

    INFTBoost public boostContract;

    uint256 public constant MAX_BOOST_BPS = 20000;        // NFT cap (2x)
    uint256 public constant MAX_TOTAL_BOOST_BPS = 30000;  // final cap (3x)

    /* ───────────────── LOCK TIERS ───────────────── */

    struct Lock {
        uint256 duration;
        uint256 multiplierBps;
    }

    Lock[] public lockTiers;

    /* ───────────────── USER STATE ───────────────── */

    struct UserInfo {
        uint256 amount;
        uint256 rewardDebt;
        uint256 unlockTime;
        uint256 multiplier;
    }

    mapping(address => UserInfo) public users;

    /* ───────────────── INIT CONTROL ───────────────── */

    bool public initialized;

    /* ───────────────── EVENTS ───────────────── */

    event Initialized(uint256 rewardRate, address boost);
    event Funded(uint256 amount);
    event RewardRateUpdated(uint256 newRate);
    event BoostUpdated(address boost);

    event Staked(address user, uint256 amount, uint256 lockDuration);
    event Unstaked(address user, uint256 amount);
    event Claimed(address user, uint256 amount);

    /* ───────────────── CONSTRUCTOR ───────────────── */

    constructor(address _staking, address _reward, address admin) {
        require(_staking != address(0) && _reward != address(0), "Zero address");

        stakingToken = IERC20(_staking);
        rewardToken = IERC20(_reward);

        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(OPERATOR_ROLE, admin);
    }

    /* ───────────────── INITIALIZATION ───────────────── */

    function initialize(uint256 _rewardRate, address _boost)
        external
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        require(!initialized, "Already initialized");

        rewardRate = _rewardRate;
        boostContract = INFTBoost(_boost);
        lastUpdateTime = block.timestamp;

        initialized = true;

        emit Initialized(_rewardRate, _boost);
    }

    /* ───────────────── GOVERNANCE ───────────────── */

    function setRewardRate(uint256 _rate)
        external
        onlyRole(OPERATOR_ROLE)
    {
        _updatePool();
        rewardRate = _rate;
        emit RewardRateUpdated(_rate);
    }

    function setBoostContract(address _boost)
        external
        onlyRole(OPERATOR_ROLE)
    {
        boostContract = INFTBoost(_boost);
        emit BoostUpdated(_boost);
    }

    function addLockTier(uint256 duration, uint256 multiplierBps)
        external
        onlyRole(OPERATOR_ROLE)
    {
        require(multiplierBps >= 10000, "Invalid multiplier");
        lockTiers.push(Lock(duration, multiplierBps));
    }

    function fundRewards(uint256 amount)
        external
        onlyRole(ALLOCATOR_ROLE)
    {
        require(amount > 0, "Zero amount");

        rewardToken.safeTransferFrom(msg.sender, address(this), amount);
        totalFunded += amount;

        emit Funded(amount);
    }

    /* ───────────────── USER ACTIONS ───────────────── */

    function stake(uint256 amount, uint256 tierIndex)
        external
        nonReentrant
        whenNotPaused
    {
        require(initialized, "Not initialized");
        require(amount > 0, "Zero amount");
        require(tierIndex < lockTiers.length, "Invalid tier");

        _updatePool();

        UserInfo storage user = users[msg.sender];

        // enforce lock integrity
        if (user.amount > 0) {
            require(block.timestamp >= user.unlockTime, "Active lock");
        }

        _harvest(msg.sender);

        Lock memory tier = lockTiers[tierIndex];

        stakingToken.safeTransferFrom(msg.sender, address(this), amount);

        user.amount += amount;
        user.unlockTime = block.timestamp + tier.duration;
        user.multiplier = tier.multiplierBps;

        totalStaked += amount;

        user.rewardDebt = _pendingBase(user);

        emit Staked(msg.sender, amount, tier.duration);
    }

    function unstake(uint256 amount)
        external
        nonReentrant
        whenNotPaused
    {
        UserInfo storage user = users[msg.sender];

        require(amount > 0, "Zero amount");
        require(user.amount >= amount, "Insufficient");
        require(block.timestamp >= user.unlockTime, "Locked");

        _updatePool();
        _harvest(msg.sender);

        user.amount -= amount;
        totalStaked -= amount;

        stakingToken.safeTransfer(msg.sender, amount);

        user.rewardDebt = _pendingBase(user);

        emit Unstaked(msg.sender, amount);
    }

    function claim()
        external
        nonReentrant
    {
        _updatePool();
        _harvest(msg.sender);
    }

    /* ───────────────── INTERNAL LOGIC ───────────────── */

    function _updatePool() internal {
        if (!initialized) return;

        if (block.timestamp <= lastUpdateTime) return;

        if (totalStaked == 0) {
            lastUpdateTime = block.timestamp;
            return;
        }

        if (totalFunded <= totalDistributed) {
            lastUpdateTime = block.timestamp;
            return;
        }

        uint256 duration = block.timestamp - lastUpdateTime;
        uint256 reward = duration * rewardRate;

        uint256 available = totalFunded - totalDistributed;
        if (reward > available) reward = available;

        accRewardPerShare += (reward * PRECISION) / totalStaked;

        lastUpdateTime = block.timestamp;
    }

    function _harvest(address userAddr) internal {
        uint256 pending = _pending(userAddr);

        if (pending > 0) {
            totalDistributed += pending;
            rewardToken.safeTransfer(userAddr, pending);

            emit Claimed(userAddr, pending);
        }

        users[userAddr].rewardDebt = _pendingBase(users[userAddr]);
    }

    function _pending(address userAddr)
        internal
        view
        returns (uint256)
    {
        UserInfo memory user = users[userAddr];

        uint256 base = _pendingBase(user);

        uint256 boost = user.multiplier;

        if (address(boostContract) != address(0)) {
            uint256 nftBoost = boostContract.getBoost(userAddr);

            if (nftBoost > MAX_BOOST_BPS) {
                nftBoost = MAX_BOOST_BPS;
            }

            boost = (boost * nftBoost) / 10000;
        }

        if (boost > MAX_TOTAL_BOOST_BPS) {
            boost = MAX_TOTAL_BOOST_BPS;
        }

        return (base * boost) / 10000;
    }

    function _pendingBase(UserInfo memory user)
        internal
        view
        returns (uint256)
    {
        return (user.amount * accRewardPerShare) / PRECISION - user.rewardDebt;
    }
}