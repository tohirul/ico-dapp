// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

/* ───────────────── IMPORTS ───────────────── */

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

/* ───────────────── INTERFACES ───────────────── */

interface ITreasuryVault {
    function transferETH(address to, uint256 amount) external;
    function transferERC20(address token, address to, uint256 amount) external;
}

/* ───────────────── CONTRACT ───────────────── */

contract TreasuryAllocator is AccessControl, ReentrancyGuard, Pausable {

    /* ───────────────── ROLES ───────────────── */

    bytes32 public constant OPERATOR_ROLE = keccak256("OPERATOR_ROLE");

    /* ───────────────── CONSTANTS ───────────────── */

    uint256 public constant BPS_DENOM = 10_000;

    /* ───────────────── STATE ───────────────── */

    ITreasuryVault public treasury;

    struct Allocation {
        uint256 stakingBps;
        uint256 liquidityBps;
        uint256 incentivesBps;
        uint256 reserveBps;
    }

    Allocation public allocation;

    /* ───────────────── DESTINATIONS ───────────────── */

    address public stakingContract;
    address public liquidityWallet;
    address public incentivesContract;
    address public reserveWallet;

    /* ───────────────── ACCOUNTING ───────────────── */

    uint256 public totalAllocatedETH;
    uint256 public totalAllocatedERC20;

    /* ───────────────── EVENTS ───────────────── */

    event AllocationUpdated(
        uint256 staking,
        uint256 liquidity,
        uint256 incentives,
        uint256 reserve
    );

    event DestinationsUpdated(
        address staking,
        address liquidity,
        address incentives,
        address reserve
    );

    event DistributedETH(uint256 total);
    event DistributedERC20(address token, uint256 total);

    /* ───────────────── CONSTRUCTOR ───────────────── */

    constructor(address _treasury, address admin) {
        require(_treasury != address(0), "Invalid treasury");

        treasury = ITreasuryVault(_treasury);

        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(OPERATOR_ROLE, admin);
    }

    /* ───────────────── CONFIG ───────────────── */

    function setAllocation(
        uint256 stakingBps,
        uint256 liquidityBps,
        uint256 incentivesBps,
        uint256 reserveBps
    ) external onlyRole(OPERATOR_ROLE) {

        uint256 total = stakingBps + liquidityBps + incentivesBps + reserveBps;
        require(total == BPS_DENOM, "Invalid allocation");

        allocation = Allocation(
            stakingBps,
            liquidityBps,
            incentivesBps,
            reserveBps
        );

        emit AllocationUpdated(
            stakingBps,
            liquidityBps,
            incentivesBps,
            reserveBps
        );
    }

    function setDestinations(
        address _staking,
        address _liquidity,
        address _incentives,
        address _reserve
    ) external onlyRole(OPERATOR_ROLE) {

        require(
            _staking != address(0) &&
            _liquidity != address(0) &&
            _incentives != address(0) &&
            _reserve != address(0),
            "Zero address"
        );

        stakingContract = _staking;
        liquidityWallet = _liquidity;
        incentivesContract = _incentives;
        reserveWallet = _reserve;

        emit DestinationsUpdated(
            _staking,
            _liquidity,
            _incentives,
            _reserve
        );
    }

    /* ───────────────── DISTRIBUTION ───────────────── */

    function distributeETH(uint256 amount)
        external
        nonReentrant
        whenNotPaused
        onlyRole(OPERATOR_ROLE)
    {
        require(amount > 0, "Zero amount");

        Allocation memory a = allocation;

        uint256 stakingAmt = (amount * a.stakingBps) / BPS_DENOM;
        uint256 liquidityAmt = (amount * a.liquidityBps) / BPS_DENOM;
        uint256 incentivesAmt = (amount * a.incentivesBps) / BPS_DENOM;
        uint256 reserveAmt = amount - stakingAmt - liquidityAmt - incentivesAmt;

        if (stakingAmt > 0)
            treasury.transferETH(stakingContract, stakingAmt);

        if (liquidityAmt > 0)
            treasury.transferETH(liquidityWallet, liquidityAmt);

        if (incentivesAmt > 0)
            treasury.transferETH(incentivesContract, incentivesAmt);

        if (reserveAmt > 0)
            treasury.transferETH(reserveWallet, reserveAmt);

        totalAllocatedETH += amount;

        emit DistributedETH(amount);
    }

    function distributeERC20(address token, uint256 amount)
        external
        nonReentrant
        whenNotPaused
        onlyRole(OPERATOR_ROLE)
    {
        require(token != address(0), "Invalid token");
        require(amount > 0, "Zero amount");

        Allocation memory a = allocation;

        uint256 stakingAmt = (amount * a.stakingBps) / BPS_DENOM;
        uint256 liquidityAmt = (amount * a.liquidityBps) / BPS_DENOM;
        uint256 incentivesAmt = (amount * a.incentivesBps) / BPS_DENOM;
        uint256 reserveAmt = amount - stakingAmt - liquidityAmt - incentivesAmt;

        if (stakingAmt > 0)
            treasury.transferERC20(token, stakingContract, stakingAmt);

        if (liquidityAmt > 0)
            treasury.transferERC20(token, liquidityWallet, liquidityAmt);

        if (incentivesAmt > 0)
            treasury.transferERC20(token, incentivesContract, incentivesAmt);

        if (reserveAmt > 0)
            treasury.transferERC20(token, reserveWallet, reserveAmt);

        totalAllocatedERC20 += amount;

        emit DistributedERC20(token, amount);
    }

    /* ───────────────── ADMIN ───────────────── */

    function pause() external onlyRole(OPERATOR_ROLE) {
        _pause();
    }

    function unpause() external onlyRole(OPERATOR_ROLE) {
        _unpause();
    }
}