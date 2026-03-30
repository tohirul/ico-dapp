// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

/*//////////////////////////////////////////////////////////////
                            IMPORTS
//////////////////////////////////////////////////////////////*/

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/*//////////////////////////////////////////////////////////////
                        CONTRACT
//////////////////////////////////////////////////////////////*/

contract PaymentProcessor is Ownable, ReentrancyGuard {

    /*//////////////////////////////////////////////////////////////
                            CONSTANTS
    //////////////////////////////////////////////////////////////*/

    uint256 public constant DENOM = 10_000;

    /*//////////////////////////////////////////////////////////////
                            STATE
    //////////////////////////////////////////////////////////////*/

    IERC20 public paymentToken;

    address public treasury;
    address public marketing;
    address public operations;

    uint256 public treasuryShare = 7000;   // 70%
    uint256 public marketingShare = 2000;  // 20%
    uint256 public operationsShare = 1000; // 10%

    /*//////////////////////////////////////////////////////////////
                        ACCOUNTING
    //////////////////////////////////////////////////////////////*/

    uint256 public totalProcessed;
    uint256 public totalToTreasury;
    uint256 public totalToMarketing;
    uint256 public totalToOperations;

    /*//////////////////////////////////////////////////////////////
                            EVENTS
    //////////////////////////////////////////////////////////////*/

    event PaymentProcessed(
        address indexed user,
        uint256 amount,
        uint256 treasuryAmount,
        uint256 marketingAmount,
        uint256 operationsAmount
    );

    event SharesUpdated(uint256 treasury, uint256 marketing, uint256 ops);
    event WalletsUpdated(address treasury, address marketing, address ops);
    event TokenUpdated(address token);

    /*//////////////////////////////////////////////////////////////
                        CONSTRUCTOR
    //////////////////////////////////////////////////////////////*/

    constructor(
        address _token,
        address _treasury,
        address _marketing,
        address _operations,
        address _owner
    ) Ownable(_owner) {
        require(_token != address(0), "INVALID_TOKEN");
        require(_treasury != address(0), "INVALID_TREASURY");
        require(_marketing != address(0), "INVALID_MARKETING");
        require(_operations != address(0), "INVALID_OPERATIONS");

        paymentToken = IERC20(_token);
        treasury = _treasury;
        marketing = _marketing;
        operations = _operations;
    }

    /*//////////////////////////////////////////////////////////////
                        PAYMENT LOGIC
    //////////////////////////////////////////////////////////////*/

    function processPayment(uint256 amount) external nonReentrant {
        require(amount > 0, "ZERO_AMOUNT");

        uint256 balanceBefore = paymentToken.balanceOf(address(this));

        paymentToken.transferFrom(msg.sender, address(this), amount);

        uint256 received = paymentToken.balanceOf(address(this)) - balanceBefore;
        require(received > 0, "TRANSFER_FAIL");

        // 🔥 deterministic split
        uint256 toTreasury = (received * treasuryShare) / DENOM;
        uint256 toMarketing = (received * marketingShare) / DENOM;
        uint256 toOperations = received - toTreasury - toMarketing;

        // 🔒 transfers (fail-safe)
        _safeTransfer(treasury, toTreasury);
        _safeTransfer(marketing, toMarketing);
        _safeTransfer(operations, toOperations);

        // 📊 accounting
        totalProcessed += received;
        totalToTreasury += toTreasury;
        totalToMarketing += toMarketing;
        totalToOperations += toOperations;

        emit PaymentProcessed(
            msg.sender,
            received,
            toTreasury,
            toMarketing,
            toOperations
        );
    }

    /*//////////////////////////////////////////////////////////////
                        INTERNAL SAFE TRANSFER
    //////////////////////////////////////////////////////////////*/

    function _safeTransfer(address to, uint256 amount) internal {
        if (amount == 0) return;

        bool success = paymentToken.transfer(to, amount);
        require(success, "TRANSFER_FAILED");
    }

    /*//////////////////////////////////////////////////////////////
                        ADMIN CONFIG
    //////////////////////////////////////////////////////////////*/

    function setShares(
        uint256 _treasury,
        uint256 _marketing,
        uint256 _operations
    ) external onlyOwner {
        require(
            _treasury + _marketing + _operations == DENOM,
            "INVALID_SPLIT"
        );

        treasuryShare = _treasury;
        marketingShare = _marketing;
        operationsShare = _operations;

        emit SharesUpdated(_treasury, _marketing, _operations);
    }

    function setWallets(
        address _treasury,
        address _marketing,
        address _operations
    ) external onlyOwner {
        require(_treasury != address(0), "ZERO");
        require(_marketing != address(0), "ZERO");
        require(_operations != address(0), "ZERO");

        treasury = _treasury;
        marketing = _marketing;
        operations = _operations;

        emit WalletsUpdated(_treasury, _marketing, _operations);
    }

    function setPaymentToken(address _token) external onlyOwner {
        require(_token != address(0), "ZERO");
        paymentToken = IERC20(_token);
        emit TokenUpdated(_token);
    }

    /*//////////////////////////////////////////////////////////////
                        VIEW HELPERS
    //////////////////////////////////////////////////////////////*/

    function previewSplit(uint256 amount)
        external
        view
        returns (
            uint256 toTreasury,
            uint256 toMarketing,
            uint256 toOperations
        )
    {
        toTreasury = (amount * treasuryShare) / DENOM;
        toMarketing = (amount * marketingShare) / DENOM;
        toOperations = amount - toTreasury - toMarketing;
    }
}