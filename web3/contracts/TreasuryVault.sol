// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

/* ───────────────── IMPORTS ───────────────── */

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/* ───────────────── INTERFACES ───────────────── */

interface ITreasuryCallable {
    function treasuryCall(bytes calldata data) external returns (bytes memory);
}

/* ───────────────── CONTRACT ───────────────── */

contract TreasuryVault is AccessControl, ReentrancyGuard, Pausable {
    using SafeERC20 for IERC20;

    /* ───────────────── ROLES ───────────────── */

    bytes32 public constant OPERATOR_ROLE  = keccak256("OPERATOR_ROLE");
    bytes32 public constant EXECUTOR_ROLE  = keccak256("EXECUTOR_ROLE");
    bytes32 public constant ALLOCATOR_ROLE = keccak256("ALLOCATOR_ROLE");

    /* ───────────────── ALLOWLISTS ───────────────── */

    mapping(address => bool) public approvedTargets;
    mapping(address => bool) public approvedRecipients;

    /* ───────────────── ACCOUNTING ───────────────── */

    uint256 public totalETHOut;
    uint256 public totalERC20Out;
    uint256 public totalAllocatedETH;
    uint256 public totalAllocatedERC20;

    uint256 public executionNonce;

    /* ───────────────── LIMITS ───────────────── */

    uint256 public maxTxValue;
    uint256 public dailyLimit;

    uint256 public spentToday;
    uint256 public lastReset;

    /* ───────────────── WITHDRAW MODEL ───────────────── */

    mapping(address => uint256) public pendingWithdrawals;

    /* ───────────────── MODES ───────────────── */

    bool public allocatorOnlyMode;

    /* ───────────────── EVENTS ───────────────── */

    event Executed(uint256 indexed nonce, address indexed target);
    event PendingWithdrawal(address indexed to, uint256 amount);
    event Withdrawn(address indexed user, uint256 amount);

    event ETHAllocated(address indexed to, uint256 amount);
    event ERC20Allocated(address indexed token, address indexed to, uint256 amount);

    event ETHTransferred(address indexed to, uint256 amount);
    event ERC20Transferred(address indexed token, address indexed to, uint256 amount);

    event TargetApproved(address target, bool status);
    event RecipientApproved(address recipient, bool status);

    event LimitsUpdated(uint256 maxTx, uint256 daily);
    event AllocatorModeUpdated(bool enabled);

    event Deposit(address indexed from, uint256 amount);

    /* ───────────────── CONSTRUCTOR ───────────────── */

    constructor(address admin) {
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(OPERATOR_ROLE, admin);
        _grantRole(EXECUTOR_ROLE, admin);

        lastReset = block.timestamp;
    }

    /* ───────────────── RECEIVE ───────────────── */

    receive() external payable {
        emit Deposit(msg.sender, msg.value);
    }

    function depositETH() external payable {
    emit Deposit(msg.sender, msg.value);
}

    /* ───────────────── ALLOWLIST MANAGEMENT ───────────────── */

    function setApprovedTarget(address target, bool status)
        external
        onlyRole(OPERATOR_ROLE)
    {
        require(target != address(0), "Zero address");
        approvedTargets[target] = status;
        emit TargetApproved(target, status);
    }

    function setApprovedRecipient(address user, bool approved)
        external
        onlyRole(OPERATOR_ROLE)
    {
        require(user != address(0), "Zero address");
        approvedRecipients[user] = approved;
        emit RecipientApproved(user, approved);
    }

    /* ───────────────── LIMIT CONTROL ───────────────── */

    function setLimits(uint256 _maxTx, uint256 _daily)
        external
        onlyRole(OPERATOR_ROLE)
    {
        maxTxValue = _maxTx;
        dailyLimit = _daily;
        emit LimitsUpdated(_maxTx, _daily);
    }

    function _enforceLimits(uint256 amount) internal {
        require(amount <= maxTxValue, "Tx limit");

        if (block.timestamp > lastReset + 1 days) {
            spentToday = 0;
            lastReset = block.timestamp;
        }

        require(spentToday + amount <= dailyLimit, "Daily limit");

        spentToday += amount;
    }

    /* ───────────────── EXECUTION ENGINE (SAFE) ───────────────── */

    function execute(
        address target,
        bytes calldata data
    )
        external
        nonReentrant
        whenNotPaused
        onlyRole(EXECUTOR_ROLE)
        returns (bytes memory)
    {
        require(!allocatorOnlyMode, "Allocator only");
        require(approvedTargets[target], "Target not approved");

        uint256 nonce = executionNonce++;

        // 🔒 NO ETH allowed in execution
        (bool success, bytes memory result) =
            target.call(data);

        require(success, "Execution failed");

        emit Executed(nonce, target);

        return result;
    }

    /* ───────────────── ETH FLOW (PULL MODEL) ───────────────── */

    function transferETH(address to, uint256 amount)
        external
        onlyRole(EXECUTOR_ROLE)
        whenNotPaused
    {
        require(!allocatorOnlyMode, "Allocator only");
        require(approvedRecipients[to], "Recipient not approved");

        _enforceLimits(amount);

        pendingWithdrawals[to] += amount;

        totalETHOut += amount;

        emit PendingWithdrawal(to, amount);
    }

    function allocatorTransferETH(address to, uint256 amount)
        external
        onlyRole(ALLOCATOR_ROLE)
        whenNotPaused
    {
        require(approvedRecipients[to], "Recipient not approved");

        _enforceLimits(amount);

        pendingWithdrawals[to] += amount;

        totalAllocatedETH += amount;

        emit ETHAllocated(to, amount);
    }

    function withdrawPending() external nonReentrant {
        uint256 amount = pendingWithdrawals[msg.sender];
        require(amount > 0, "Nothing to withdraw");

        pendingWithdrawals[msg.sender] = 0;

        (bool ok, ) = payable(msg.sender).call{value: amount}("");
        require(ok, "Withdraw failed");

        emit Withdrawn(msg.sender, amount);
    }

    /* ───────────────── ERC20 FLOW ───────────────── */

    function transferERC20(address token, address to, uint256 amount)
        external
        onlyRole(EXECUTOR_ROLE)
        whenNotPaused
    {
        require(!allocatorOnlyMode, "Allocator only");
        require(approvedRecipients[to], "Recipient not approved");

        IERC20(token).safeTransfer(to, amount);

        totalERC20Out += amount;

        emit ERC20Transferred(token, to, amount);
    }

    function allocatorTransferERC20(address token, address to, uint256 amount)
        external
        onlyRole(ALLOCATOR_ROLE)
        whenNotPaused
    {
        require(approvedRecipients[to], "Recipient not approved");

        IERC20(token).safeTransfer(to, amount);

        totalAllocatedERC20 += amount;

        emit ERC20Allocated(token, to, amount);
    }

    /* ───────────────── ADMIN ───────────────── */

    function setAllocatorOnlyMode(bool enabled)
        external
        onlyRole(OPERATOR_ROLE)
    {
        allocatorOnlyMode = enabled;
        emit AllocatorModeUpdated(enabled);
    }

    function pause() external onlyRole(OPERATOR_ROLE) {
        _pause();
    }

    function unpause() external onlyRole(OPERATOR_ROLE) {
        _unpause();
    }
}