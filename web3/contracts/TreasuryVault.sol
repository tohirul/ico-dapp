// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

/*//////////////////////////////////////////////////////////////
                            IMPORTS
//////////////////////////////////////////////////////////////*/

import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/*//////////////////////////////////////////////////////////////
                        CONTRACT
//////////////////////////////////////////////////////////////*/

contract TreasuryVault is ReentrancyGuard {
    using SafeERC20 for IERC20;

    /*//////////////////////////////////////////////////////////////
                            CONSTANTS
    //////////////////////////////////////////////////////////////*/

    uint256 public constant MAX_BATCH = 50;

    /*//////////////////////////////////////////////////////////////
                            ROLES
    //////////////////////////////////////////////////////////////*/

    address public immutable timelock;

    /*//////////////////////////////////////////////////////////////
                        ACCOUNTING
    //////////////////////////////////////////////////////////////*/

    uint256 public totalETHReceived;
    uint256 public totalETHWithdrawn;

    mapping(address => uint256) public totalTokenReceived;
    mapping(address => uint256) public totalTokenWithdrawn;

    /*//////////////////////////////////////////////////////////////
                            EVENTS
    //////////////////////////////////////////////////////////////*/

    event ETHReceived(address indexed from, uint256 amount);
    event TokenReceived(address indexed token, address indexed from, uint256 amount);

    event ETHWithdrawn(address indexed to, uint256 amount);
    event TokenWithdrawn(address indexed token, address indexed to, uint256 amount);

    event BatchExecuted(uint256 operations);

    /*//////////////////////////////////////////////////////////////
                            MODIFIER
    //////////////////////////////////////////////////////////////*/

    modifier onlyTimelock() {
        require(msg.sender == timelock, "NOT_TIMELOCK");
        _;
    }

    /*//////////////////////////////////////////////////////////////
                        CONSTRUCTOR
    //////////////////////////////////////////////////////////////*/

    constructor(address _timelock) {
        require(_timelock != address(0), "ZERO_TIMELOCK");
        timelock = _timelock;
    }

    /*//////////////////////////////////////////////////////////////
                        ETH RECEIPT
    //////////////////////////////////////////////////////////////*/

    receive() external payable {
        require(msg.value > 0, "ZERO_VALUE");

        totalETHReceived += msg.value;

        emit ETHReceived(msg.sender, msg.value);
    }

    /*//////////////////////////////////////////////////////////////
                        TOKEN DEPOSIT (OPTIONAL TRACKED)
    //////////////////////////////////////////////////////////////*/

    function depositToken(address token, uint256 amount) external nonReentrant {
        require(token != address(0), "ZERO_TOKEN");
        require(amount > 0, "ZERO_AMOUNT");

        IERC20(token).safeTransferFrom(msg.sender, address(this), amount);

        totalTokenReceived[token] += amount;

        emit TokenReceived(token, msg.sender, amount);
    }

    /*//////////////////////////////////////////////////////////////
                        INTERNAL TRANSFERS
    //////////////////////////////////////////////////////////////*/

    function _sendETH(address to, uint256 amount) internal {
        (bool success, ) = to.call{value: amount}("");
        require(success, "ETH_FAIL");
    }

    function _sendToken(IERC20 token, address to, uint256 amount) internal {
        token.safeTransfer(to, amount);
    }

    /*//////////////////////////////////////////////////////////////
                        WITHDRAW ETH
    //////////////////////////////////////////////////////////////*/

    function withdrawETH(address to, uint256 amount)
        external
        onlyTimelock
        nonReentrant
    {
        require(to != address(0), "ZERO_TO");
        require(amount > 0, "ZERO_AMOUNT");

        uint256 bal = address(this).balance;
        require(bal >= amount, "INSUFFICIENT");

        totalETHWithdrawn += amount;

        _sendETH(to, amount);

        emit ETHWithdrawn(to, amount);
    }

    /*//////////////////////////////////////////////////////////////
                        WITHDRAW TOKEN
    //////////////////////////////////////////////////////////////*/

    function withdrawToken(
        address token,
        address to,
        uint256 amount
    ) external onlyTimelock nonReentrant {
        require(token != address(0), "ZERO_TOKEN");
        require(to != address(0), "ZERO_TO");
        require(amount > 0, "ZERO_AMOUNT");

        IERC20 erc20 = IERC20(token);

        uint256 bal = erc20.balanceOf(address(this));
        require(bal >= amount, "INSUFFICIENT");

        totalTokenWithdrawn[token] += amount;

        _sendToken(erc20, to, amount);

        emit TokenWithdrawn(token, to, amount);
    }

    /*//////////////////////////////////////////////////////////////
                        BATCH EXECUTION (DAO READY)
    //////////////////////////////////////////////////////////////*/

    struct Operation {
        uint8 opType; // 1 = ETH, 2 = TOKEN
        address token;
        address to;
        uint256 amount;
    }

    function executeBatch(Operation[] calldata ops)
        external
        onlyTimelock
        nonReentrant
    {
        uint256 len = ops.length;
        require(len > 0 && len <= MAX_BATCH, "INVALID_BATCH");

        for (uint256 i = 0; i < len; i++) {
            Operation calldata op = ops[i];

            if (op.opType == 1) {
                // ETH
                require(address(this).balance >= op.amount, "ETH_LOW");

                totalETHWithdrawn += op.amount;
                _sendETH(op.to, op.amount);

                emit ETHWithdrawn(op.to, op.amount);

            } else if (op.opType == 2) {
                // TOKEN
                IERC20 token = IERC20(op.token);

                uint256 bal = token.balanceOf(address(this));
                require(bal >= op.amount, "TOKEN_LOW");

                totalTokenWithdrawn[op.token] += op.amount;
                _sendToken(token, op.to, op.amount);

                emit TokenWithdrawn(op.token, op.to, op.amount);

            } else {
                revert("INVALID_OP");
            }
        }

        emit BatchExecuted(len);
    }

    /*//////////////////////////////////////////////////////////////
                        VIEW HELPERS
    //////////////////////////////////////////////////////////////*/

    function getETHBalance() external view returns (uint256) {
        return address(this).balance;
    }

    function getTokenBalance(address token)
        external
        view
        returns (uint256)
    {
        return IERC20(token).balanceOf(address(this));
    }

    function netETH() external view returns (uint256) {
        return totalETHReceived - totalETHWithdrawn;
    }

    function netToken(address token) external view returns (uint256) {
        return totalTokenReceived[token] - totalTokenWithdrawn[token];
    }
}