// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

/*//////////////////////////////////////////////////////////////
                            IMPORTS
//////////////////////////////////////////////////////////////*/

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/*//////////////////////////////////////////////////////////////
                        NFT BOOST INTERFACE
//////////////////////////////////////////////////////////////*/

interface INFTBoost {
    function getBoost(address user) external view returns (uint256); 
    // returns boost in BPS (e.g. 12000 = 1.2x)
}

/*//////////////////////////////////////////////////////////////
                        CONTRACT
//////////////////////////////////////////////////////////////*/

contract Staking is Ownable, ReentrancyGuard {

    /*//////////////////////////////////////////////////////////////
                            CONSTANTS
    //////////////////////////////////////////////////////////////*/

    uint256 public constant PRECISION = 1e12;
    uint256 public constant MAX_BOOST = 20000; // 2x cap
    uint256 public constant BASE_BOOST = 10000;

    /*//////////////////////////////////////////////////////////////
                            TOKENS
    //////////////////////////////////////////////////////////////*/

    IERC20 public immutable stakingToken;
    IERC20 public immutable rewardToken;

    address public treasury;
    INFTBoost public nftBoost;

    /*//////////////////////////////////////////////////////////////
                        REWARD STATE
    //////////////////////////////////////////////////////////////*/

    uint256 public rewardRate; // tokens per second
    uint256 public lastUpdateTime;
    uint256 public accRewardPerShare;

    uint256 public totalStaked;

    /*//////////////////////////////////////////////////////////////
                        BUDGET CONTROL
    //////////////////////////////////////////////////////////////*/

    uint256 public rewardBudget;     // total allocated
    uint256 public rewardDistributed; // total paid out

    /*//////////////////////////////////////////////////////////////
                        USER STATE
    //////////////////////////////////////////////////////////////*/

    struct User {
        uint256 amount;
        uint256 rewardDebt;
        uint256 pending;
    }

    mapping(address => User) public users;

    /*//////////////////////////////////////////////////////////////
                            EVENTS
    //////////////////////////////////////////////////////////////*/

    event Staked(address indexed user, uint256 amount);
    event Withdrawn(address indexed user, uint256 amount);
    event Claimed(address indexed user, uint256 amount);
    event RewardFunded(uint256 amount);
    event RewardRateUpdated(uint256 rate);
    event NFTBoostSet(address nft);

    /*//////////////////////////////////////////////////////////////
                        CONSTRUCTOR
    //////////////////////////////////////////////////////////////*/

    constructor(
        address _stakingToken,
        address _rewardToken,
        address _treasury,
        address _owner
    ) Ownable(_owner) {
        require(_stakingToken != address(0), "INVALID_STAKE");
        require(_rewardToken != address(0), "INVALID_REWARD");
        require(_treasury != address(0), "INVALID_TREASURY");

        stakingToken = IERC20(_stakingToken);
        rewardToken = IERC20(_rewardToken);
        treasury = _treasury;
    }

    /*//////////////////////////////////////////////////////////////
                        CORE UPDATE LOGIC
    //////////////////////////////////////////////////////////////*/

    function _updatePool() internal {
        if (block.timestamp <= lastUpdateTime) return;

        if (totalStaked == 0) {
            lastUpdateTime = block.timestamp;
            return;
        }

        uint256 timeElapsed = block.timestamp - lastUpdateTime;
        uint256 reward = timeElapsed * rewardRate;

        // 🔒 HARD CAP ENFORCEMENT
        uint256 remaining = rewardBudget - rewardDistributed;
        if (reward > remaining) {
            reward = remaining;
        }

        if (reward == 0) {
            lastUpdateTime = block.timestamp;
            return;
        }

        accRewardPerShare += (reward * PRECISION) / totalStaked;
        rewardDistributed += reward;

        lastUpdateTime = block.timestamp;
    }

    /*//////////////////////////////////////////////////////////////
                        BOOST LOGIC
    //////////////////////////////////////////////////////////////*/

    function _getBoost(address user) internal view returns (uint256) {
        if (address(nftBoost) == address(0)) return BASE_BOOST;

        uint256 boost = nftBoost.getBoost(user);

        if (boost < BASE_BOOST) return BASE_BOOST;
        if (boost > MAX_BOOST) return MAX_BOOST;

        return boost;
    }

    /*//////////////////////////////////////////////////////////////
                        VIEW PENDING
    //////////////////////////////////////////////////////////////*/

    function pendingRewards(address userAddr) external view returns (uint256) {
        User memory u = users[userAddr];

        uint256 _acc = accRewardPerShare;

        if (block.timestamp > lastUpdateTime && totalStaked != 0) {
            uint256 timeElapsed = block.timestamp - lastUpdateTime;
            uint256 reward = timeElapsed * rewardRate;

            uint256 remaining = rewardBudget - rewardDistributed;
            if (reward > remaining) reward = remaining;

            _acc += (reward * PRECISION) / totalStaked;
        }

        uint256 base = (u.amount * _acc) / PRECISION - u.rewardDebt;
        uint256 boost = _getBoost(userAddr);

        return (base * boost) / BASE_BOOST + u.pending;
    }

    /*//////////////////////////////////////////////////////////////
                        STAKE
    //////////////////////////////////////////////////////////////*/

    function stake(uint256 amount) external nonReentrant {
        require(amount > 0, "ZERO");

        _updatePool();

        User storage u = users[msg.sender];

        if (u.amount > 0) {
            uint256 pending = (u.amount * accRewardPerShare) / PRECISION - u.rewardDebt;
            u.pending += pending;
        }

        stakingToken.transferFrom(msg.sender, address(this), amount);

        u.amount += amount;
        totalStaked += amount;

        u.rewardDebt = (u.amount * accRewardPerShare) / PRECISION;

        emit Staked(msg.sender, amount);
    }

    /*//////////////////////////////////////////////////////////////
                        WITHDRAW
    //////////////////////////////////////////////////////////////*/

    function withdraw(uint256 amount) external nonReentrant {
        User storage u = users[msg.sender];
        require(u.amount >= amount, "INSUFFICIENT");

        _updatePool();

        uint256 pending = (u.amount * accRewardPerShare) / PRECISION - u.rewardDebt;
        u.pending += pending;

        u.amount -= amount;
        totalStaked -= amount;

        stakingToken.transfer(msg.sender, amount);

        u.rewardDebt = (u.amount * accRewardPerShare) / PRECISION;

        emit Withdrawn(msg.sender, amount);
    }

    /*//////////////////////////////////////////////////////////////
                        CLAIM
    //////////////////////////////////////////////////////////////*/

    function claim() external nonReentrant {
        _updatePool();

        User storage u = users[msg.sender];

        uint256 pending = (u.amount * accRewardPerShare) / PRECISION - u.rewardDebt;
        uint256 total = u.pending + pending;

        require(total > 0, "NO_REWARD");

        u.pending = 0;
        u.rewardDebt = (u.amount * accRewardPerShare) / PRECISION;

        uint256 boost = _getBoost(msg.sender);
        uint256 finalReward = (total * boost) / BASE_BOOST;

        // 🔒 FINAL BUDGET CHECK (ABSOLUTE SAFETY)
        require(rewardDistributed <= rewardBudget, "OVER_DISTRIBUTION");

        rewardToken.transferFrom(treasury, msg.sender, finalReward);

        emit Claimed(msg.sender, finalReward);
    }

    /*//////////////////////////////////////////////////////////////
                        FUNDING
    //////////////////////////////////////////////////////////////*/

    function fundRewards(uint256 amount) external onlyOwner {
        require(amount > 0, "ZERO");

        rewardToken.transferFrom(msg.sender, treasury, amount);
        rewardBudget += amount;

        emit RewardFunded(amount);
    }

    function setRewardRate(uint256 rate) external onlyOwner {
        _updatePool();
        rewardRate = rate;
        emit RewardRateUpdated(rate);
    }

    function setNFTBoost(address _nft) external onlyOwner {
        nftBoost = INFTBoost(_nft);
        emit NFTBoostSet(_nft);
    }
}