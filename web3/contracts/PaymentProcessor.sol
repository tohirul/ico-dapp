// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

/* ───────────────── IMPORTS ───────────────── */

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

import "@openzeppelin/contracts/utils/cryptography/EIP712.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/* ───────────────── CONTRACT ───────────────── */

contract PaymentProcessor is
    AccessControl,
    ReentrancyGuard,
    Pausable,
    EIP712
{
    using SafeERC20 for IERC20;

    /* ───────────────── ROLES ───────────────── */

    bytes32 public constant OPERATOR_ROLE = keccak256("OPERATOR_ROLE");
    bytes32 public constant SIGNER_ROLE = keccak256("SIGNER_ROLE");

    /* ───────────────── CONSTANTS ───────────────── */

    uint256 public constant BPS_DENOM = 10_000;

    /* ───────────────── EIP712 ───────────────── */

    string private constant NAME = "PaymentProcessor";
    string private constant VERSION = "1";

    bytes32 private constant PAYMENT_TYPEHASH =
        keccak256(
            "Payment(bytes32 paymentId,address payer,address token,uint256 amount,address recipient,uint256 deadline)"
        );

    /* ───────────────── STATE ───────────────── */

    address public treasuryVault;

    mapping(bytes32 => bool) public processedPayments;

    mapping(address => bool) public allowedTokens;
    mapping(address => bool) public approvedRecipients;

    uint256 public totalReceived;
    uint256 public totalProcessed;

    bool public signatureRequired = true;

    /* ───────────────── EVENTS ───────────────── */

    event PaymentProcessed(
        bytes32 indexed paymentId,
        address indexed payer,
        address indexed token,
        uint256 amount,
        address recipient
    );

    event TreasuryVaultUpdated(address vault);
    event TokenAllowed(address token, bool allowed);
    event RecipientApproved(address recipient, bool approved);
    event SignatureRequirementUpdated(bool required);

    /* ───────────────── CONSTRUCTOR ───────────────── */

    constructor(address _vault, address admin)
        EIP712(NAME, VERSION)
    {
        require(_vault != address(0), "Invalid vault");

        treasuryVault = _vault;

        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(OPERATOR_ROLE, admin);
        _grantRole(SIGNER_ROLE, admin);
    }

    /* ───────────────── PAYMENT ENTRY ───────────────── */

    function payETH(
        bytes32 paymentId,
        address recipient,
        uint256 deadline,
        bytes calldata signature
    )
        external
        payable
        nonReentrant
        whenNotPaused
    {
        require(msg.value > 0, "Zero payment");

        _processPayment(
            paymentId,
            msg.sender,
            address(0),
            msg.value,
            recipient,
            deadline,
            signature
        );
    }

    function payERC20(
        bytes32 paymentId,
        address token,
        uint256 amount,
        address recipient,
        uint256 deadline,
        bytes calldata signature
    )
        external
        nonReentrant
        whenNotPaused
    {
        require(amount > 0, "Zero amount");
        require(allowedTokens[token], "Token not allowed");

        IERC20(token).safeTransferFrom(msg.sender, address(this), amount);

        _processPayment(
            paymentId,
            msg.sender,
            token,
            amount,
            recipient,
            deadline,
            signature
        );
    }

    /* ───────────────── CORE LOGIC ───────────────── */

    function _processPayment(
        bytes32 paymentId,
        address payer,
        address token,
        uint256 amount,
        address recipient,
        uint256 deadline,
        bytes calldata signature
    ) internal {
        require(!processedPayments[paymentId], "Already processed");
        require(recipient != address(0), "Invalid recipient");

        if (approvedRecipients[recipient]) {
            // optional strict mode
        }

        if (signatureRequired) {
            _verifySignature(
                paymentId,
                payer,
                token,
                amount,
                recipient,
                deadline,
                signature
            );
        }

        processedPayments[paymentId] = true;

        totalReceived += amount;

        _forwardFunds(token, amount);

        totalProcessed += amount;

        require(totalProcessed <= totalReceived, "Invariant broken");

        emit PaymentProcessed(paymentId, payer, token, amount, recipient);
    }

    /* ───────────────── SIGNATURE VERIFY (EIP712) ───────────────── */

    function _verifySignature(
        bytes32 paymentId,
        address payer,
        address token,
        uint256 amount,
        address recipient,
        uint256 deadline,
        bytes calldata signature
    ) internal view {
        require(block.timestamp <= deadline, "Expired");

        bytes32 structHash = keccak256(
            abi.encode(
                PAYMENT_TYPEHASH,
                paymentId,
                payer,
                token,
                amount,
                recipient,
                deadline
            )
        );

        bytes32 digest = _hashTypedDataV4(structHash);

        address signer = ECDSA.recover(digest, signature);

        require(hasRole(SIGNER_ROLE, signer), "Invalid signature");
    }

    /* ───────────────── FUND ROUTING ───────────────── */

    function _forwardFunds(address token, uint256 amount) internal {
        if (token == address(0)) {
            (bool ok, ) = treasuryVault.call{value: amount}("");
            require(ok, "ETH transfer failed");
        } else {
            IERC20(token).safeTransfer(treasuryVault, amount);
        }
    }

    /* ───────────────── ADMIN ───────────────── */

    function setTreasuryVault(address _vault)
        external
        onlyRole(OPERATOR_ROLE)
    {
        require(_vault != address(0), "Zero address");
        treasuryVault = _vault;

        emit TreasuryVaultUpdated(_vault);
    }

    function setAllowedToken(address token, bool allowed)
        external
        onlyRole(OPERATOR_ROLE)
    {
        allowedTokens[token] = allowed;
        emit TokenAllowed(token, allowed);
    }

    function setApprovedRecipient(address recipient, bool approved)
        external
        onlyRole(OPERATOR_ROLE)
    {
        approvedRecipients[recipient] = approved;
        emit RecipientApproved(recipient, approved);
    }

    function setSignatureRequired(bool required)
        external
        onlyRole(OPERATOR_ROLE)
    {
        signatureRequired = required;
        emit SignatureRequirementUpdated(required);
    }

    function pause() external onlyRole(OPERATOR_ROLE) {
        _pause();
    }

    function unpause() external onlyRole(OPERATOR_ROLE) {
        _unpause();
    }

    /* ───────────────── RECEIVE ───────────────── */

    receive() external payable {}
}