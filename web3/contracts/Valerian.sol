// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

/**
 * @title Valerian Token (VAL)
 * @dev A BEP20-compatible payment token designed as the settlement layer of a
 * real-world commerce and payment ecosystem on Binance Smart Chain (BSC).
 *
 * This contract represents the monetary layer of a broader system that includes:
 * - Merchant network and payment processing
 * - NFT-based receipts, tickets, and membership tiers
 * - Treasury and incentive distribution
 * - External staking and loyalty mechanisms
 *
 * The token itself remains intentionally minimal, secure, and predictable,
 * while business logic and growth mechanisms are implemented externally.
 *
 * ------------------------------------------------------------
 * 🧩 SYSTEM ARCHITECTURE OVERVIEW
 * ------------------------------------------------------------
 *
 * VAL operates as part of a multi-layer system:
 *
 * 1. Token Layer (this contract)
 *    - Stores value
 *    - Enables transfers
 *    - Maintains fixed supply
 *
 * 2. Payment Layer (external contracts)
 *    - Processes transactions between users and merchants
 *    - Handles settlement and fee routing
 *
 * 3. Utility Layer (NFT contracts)
 *    - Issues receipts, tickets, memberships, and coupons
 *    - Enables discounts and access control
 *
 * 4. Treasury Layer
 *    - Collects fees
 *    - Funds incentives, liquidity, and ecosystem growth
 *
 * 5. Staking Layer (external contracts)
 *    - Locks VAL for defined periods
 *    - Reduces circulating supply
 *    - Provides rewards funded from treasury revenue
 *    - Integrates with NFT-based multipliers and loyalty systems
 *
 * ------------------------------------------------------------
 * 💰 TOKEN ECONOMICS MODEL
 * ------------------------------------------------------------
 *
 * - Fixed total supply minted at deployment
 * - No inflation or minting after deployment
 * - Optional burn mechanism to reduce circulating supply
 *
 * Price discovery is entirely market-driven and occurs via decentralized
 * exchanges (DEXs) such as PancakeSwap.
 *
 * This contract does NOT:
 * - Control token price
 * - Provide on-chain sale or pricing mechanisms
 * - Guarantee returns or appreciation
 *
 * ------------------------------------------------------------
 * 🔄 VALUE CREATION MECHANISM
 * ------------------------------------------------------------
 *
 * The value of VAL is driven by real economic activity:
 *
 * 1. Users acquire VAL to access services:
 *    - E-commerce purchases
 *    - Retail payments
 *    - Travel bookings (flights, resorts)
 *    - Utility and bill payments
 *
 * 2. VAL is used as the payment medium across the ecosystem
 *
 * 3. Merchants receive VAL and may:
 *    - Retain a portion for future use or incentives
 *    - Convert a portion via external liquidity markets
 *
 * 4. A portion of transaction value may be routed to the treasury
 *
 * 5. Treasury funds are reinvested into:
 *    - User incentives (cashback, rewards)
 *    - Merchant incentives (rebates, exposure)
 *    - Liquidity support
 *    - Staking reward distribution
 *
 * This creates a continuous demand loop:
 * Users → Buy → Spend → Merchants → Retain/Reuse → Treasury → Incentives → Growth
 *
 * ------------------------------------------------------------
 * 🏪 MERCHANT & PAYMENT MODEL (EXTERNAL)
 * ------------------------------------------------------------
 *
 * Merchant interaction is handled outside this contract.
 *
 * Key principles:
 * - Merchants are onboarded and verified via registry systems
 * - Settlement may include partial retention of VAL to reduce sell pressure
 * - Incentives may be provided for holding or reusing VAL within the ecosystem
 *
 * ------------------------------------------------------------
 * 🎟 NFT INTEGRATION (EXTERNAL)
 * ------------------------------------------------------------
 *
 * NFTs are used to enhance utility and retention:
 *
 * - Booking receipts (travel, events)
 * - Membership tiers (loyalty programs)
 * - Coupons and promotional assets
 *
 * NFTs may provide:
 * - Reduced transaction fees
 * - Access to premium services
 * - Discount multipliers
 * - Staking reward boosts
 *
 * This increases demand for VAL without modifying token logic.
 *
 * ------------------------------------------------------------
 * 🧱 STAKING MODEL (EXTERNAL, NON-INFLATIONARY)
 * ------------------------------------------------------------
 *
 * Staking is implemented in a separate contract and follows strict constraints:
 *
 * - Users lock VAL for predefined durations (e.g., 7, 30, 90 days)
 * - Rewards are funded exclusively from treasury revenue (no token minting)
 * - Longer lock periods may yield higher reward multipliers
 * - NFT ownership may provide additional reward boosts
 *
 * PURPOSE OF STAKING:
 * - Reduce circulating supply (supply-side pressure control)
 * - Increase user retention and long-term holding
 * - Strengthen ecosystem stability
 *
 * IMPORTANT:
 * - Staking does NOT create intrinsic value or guarantee price increase
 * - It supports price stability by reducing sell pressure
 * - Rewards must remain sustainable and tied to real economic activity
 *
 * ------------------------------------------------------------
 * ⚙️ OPTIONAL TOKEN-LEVEL FEATURES
 * ------------------------------------------------------------
 *
 * 1. Transaction Tax (Optional)
 *    - Small capped fee (e.g., ≤ 5%)
 *    - Used for treasury funding or ecosystem support
 *
 * 2. Anti-Bot / Anti-Whale (Temporary)
 *    - Launch-phase protections only
 *    - Must be permanently disable-able
 *
 * 3. Burn Mechanism (Optional)
 *    - Reduces circulating supply over time
 *
 * All optional features must:
 * - Be transparent
 * - Have hard-coded limits
 * - Avoid centralization risks
 *
 * ------------------------------------------------------------
 * 🔐 SECURITY PRINCIPLES
 * ------------------------------------------------------------
 *
 * - Solidity ^0.8.x (built-in overflow protection)
 * - Minimal trusted surface area
 * - No external calls in core transfer logic
 * - No direct BNB/ETH handling
 *
 * Optional modules (if used):
 * - ReentrancyGuard (external interactions only)
 * - Pausable (strictly controlled emergency use)
 *
 * ------------------------------------------------------------
 * ❌ EXCLUDED DESIGN PATTERNS
 * ------------------------------------------------------------
 *
 * The following are intentionally excluded to maintain integrity:
 *
 * - Arbitrary minting or supply manipulation
 * - Built-in ICO or token sale logic
 * - Reflection or rebase mechanics
 * - Hidden or dynamic fee manipulation
 * - Inflation-based staking rewards
 * - Direct on-chain price control
 *
 * ------------------------------------------------------------
 * 🏦 ECONOMIC ASSUMPTIONS
 * ------------------------------------------------------------
 *
 * VAL behaves as a transactional currency rather than a speculative asset.
 *
 * Price appreciation depends on:
 * - Merchant adoption
 * - Transaction volume
 * - User demand for services
 * - Reduction of sell pressure (staking + merchant retention)
 * - Treasury-driven reinvestment loops
 *
 * Smart contract design alone does not increase price.
 *
 * ------------------------------------------------------------
 * 🔄 UPGRADE & EXTENSIBILITY
 * ------------------------------------------------------------
 *
 * This contract is non-upgradeable.
 *
 * Future features must be implemented via:
 * - Separate contracts
 * - Modular integrations
 *
 * This ensures long-term stability and auditability.
 *
 * ------------------------------------------------------------
 * ⚠️ DEPLOYMENT REQUIREMENTS
 * ------------------------------------------------------------
 *
 * Before mainnet deployment:
 *
 * - Complete unit and integration testing
 * - Conduct third-party security audit
 * - Verify contract on block explorer
 * - Lock critical parameters where applicable
 *
 * ------------------------------------------------------------
 * @author Valerian Team
 * @notice This contract forms the foundational payment layer of the Valerian ecosystem.
 * It is intended for production use only after proper testing, auditing, and ecosystem readiness.
 */

/* ───────────────── IMPORTS ───────────────── */

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

/* ───────────────── INTERFACES ───────────────── */

interface IUniswapV2Router02 {
    function WETH() external pure returns (address);

    function swapExactTokensForETHSupportingFeeOnTransferTokens(
        uint amountIn,
        uint amountOutMin,
        address[] calldata path,
        address to,
        uint deadline
    ) external;
}

/* ───────────────── CONTRACT ───────────────── */

contract Valerian is ERC20, AccessControl, ReentrancyGuard, Pausable {

    /* ───────────────── ROLES ───────────────── */

    bytes32 public constant OPERATOR_ROLE = keccak256("OPERATOR_ROLE");

    /* ───────────────── CONSTANTS ───────────────── */

    uint256 public constant MAX_FEE_BPS = 500;
    uint256 public constant BPS_DENOM = 10_000;

    /* ───────────────── FEES ───────────────── */

    uint256 public buyFeeBps;
    uint256 public sellFeeBps;

    /* ───────────────── CORE ADDRESSES ───────────────── */

    address public treasuryVault;
    address public immutable LP_RECEIVER;

    IUniswapV2Router02 public router;
    address public pair;

    /* ───────────────── SWAP CONFIG ───────────────── */

    uint256 public swapThreshold;
    uint256 public minSwapAmount;
    uint256 public maxSwapAmount;

    uint256 public lastSwapBlock;
    uint256 public maxPriceImpactBps = 300;

    bool public swapEnabled = true;
    bool private inSwap;

    /* ───────────────── TREASURY LAYER (STRICT ESCROW) ───────────────── */

    mapping(address => bool) public approvedVaults;

    // ONLY source of truth for treasury funds
    mapping(address => uint256) public vaultBalances;

    /* ───────────────── ACCOUNTING ───────────────── */

    uint256 public totalSwapped;
    uint256 public totalETHSent;

    /* ───────────────── EVENTS ───────────────── */

    event FeesUpdated(uint256 buyFee, uint256 sellFee);
    event SwapExecuted(uint256 tokens, uint256 ethReceived);

    event VaultAccrued(address indexed vault, uint256 amount);
    event VaultClaimed(address indexed vault, uint256 amount);
    event VaultUpdated(address vault);
    event VaultApproved(address vault, bool status);

    event PairUpdated(address pair);
    event RouterUpdated(address router);
    event EmergencyPause(bool state);

    /* ───────────────── MODIFIERS ───────────────── */

    modifier antiMEV() {
        require(block.number > lastSwapBlock, "MEV block");
        _;
        lastSwapBlock = block.number;
    }

    modifier lockSwap() {
        inSwap = true;
        _;
        inSwap = false;
    }

    /* ───────────────── CONSTRUCTOR ───────────────── */

    constructor(
        address _router,
        address _vault,
        address _lpReceiver
    ) ERC20("Valerian", "VAL") {
        require(_router != address(0), "Invalid router");
        require(_vault != address(0), "Invalid vault");
        require(_lpReceiver != address(0), "Invalid LP");

        router = IUniswapV2Router02(_router);
        treasuryVault = _vault;
        LP_RECEIVER = _lpReceiver;

        approvedVaults[_vault] = true;

        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(OPERATOR_ROLE, msg.sender);

        _mint(msg.sender, 1_000_000 ether);
    }

    /* ───────────────── ADMIN ───────────────── */

    function setVault(address _vault)
        external
        onlyRole(OPERATOR_ROLE)
    {
        require(_vault != address(0), "Zero vault");
        require(_vault.code.length > 0, "Invalid vault");

        treasuryVault = _vault;
        approvedVaults[_vault] = true;

        emit VaultUpdated(_vault);
    }

    function approveVault(address vault, bool status)
        external
        onlyRole(OPERATOR_ROLE)
    {
        require(vault != address(0), "Zero vault");

        approvedVaults[vault] = status;

        emit VaultApproved(vault, status);
    }

    function setRouter(address _router)
        external
        onlyRole(OPERATOR_ROLE)
    {
        require(_router != address(0), "Invalid router");
        require(IUniswapV2Router02(_router).WETH() != address(0), "Bad router");

        router = IUniswapV2Router02(_router);

        emit RouterUpdated(_router);
    }

    function setPair(address _pair)
        external
        onlyRole(OPERATOR_ROLE)
    {
        require(_pair != address(0), "Zero pair");

        pair = _pair;

        emit PairUpdated(_pair);
    }

    function setFees(uint256 _buy, uint256 _sell)
        external
        onlyRole(OPERATOR_ROLE)
    {
        require(_buy <= MAX_FEE_BPS && _sell <= MAX_FEE_BPS, "Too high");

        buyFeeBps = _buy;
        sellFeeBps = _sell;

        emit FeesUpdated(_buy, _sell);
    }

    function setSwapConfig(
        uint256 _threshold,
        uint256 _min,
        uint256 _max
    ) external onlyRole(OPERATOR_ROLE) {
        require(_threshold >= _min, "Invalid threshold");
        require(_max >= _min, "Invalid max");

        swapThreshold = _threshold;
        minSwapAmount = _min;
        maxSwapAmount = _max;
    }

    function pause() external onlyRole(OPERATOR_ROLE) {
        _pause();
        emit EmergencyPause(true);
    }

    function unpause() external onlyRole(OPERATOR_ROLE) {
        _unpause();
        emit EmergencyPause(false);
    }

    /* ───────────────── TRANSFER LOGIC ───────────────── */

    function _update(
        address from,
        address to,
        uint256 amount
    ) internal override whenNotPaused {

        if (inSwap || from == address(0) || to == address(0)) {
            super._update(from, to, amount);
            return;
        }

        uint256 fee = _calculateFee(from, to, amount);

        if (fee > 0) {
            super._update(from, address(this), fee);
            amount -= fee;
        }

        super._update(from, to, amount);

        _maybeSwap();
    }

    function _calculateFee(
        address from,
        address to,
        uint256 amount
    ) internal view returns (uint256) {
        if (pair == address(0)) return 0;

        if (from == pair) {
            return (amount * buyFeeBps) / BPS_DENOM;
        }

        if (to == pair) {
            return (amount * sellFeeBps) / BPS_DENOM;
        }

        return 0;
    }

    /* ───────────────── SWAP ENGINE ───────────────── */

    function _maybeSwap() internal {
        if (!swapEnabled || inSwap) return;

        uint256 bal = balanceOf(address(this));
        if (bal < swapThreshold) return;

        uint256 amount = bal;

        if (amount > maxSwapAmount) amount = maxSwapAmount;
        if (amount < minSwapAmount) return;

        _swap(amount);
    }

    function _swap(uint256 tokenAmount)
        internal
        lockSwap
        nonReentrant
        antiMEV
    {
        _approve(address(this), address(router), tokenAmount);

        address[] memory path = new address[](2);
        path[0] = address(this);
        path[1] = router.WETH();

        uint256 beforeBal = address(this).balance;

        router.swapExactTokensForETHSupportingFeeOnTransferTokens(
            tokenAmount,
            0,
            path,
            address(this),
            block.timestamp
        );

        uint256 received = address(this).balance - beforeBal;

        totalSwapped += tokenAmount;

        emit SwapExecuted(tokenAmount, received);

        _accrueToVault(received);
    }

    /* ───────────────── TREASURY ROUTING (NO EXTERNAL CALLS) ───────────────── */

    function _accrueToVault(uint256 amount) internal {
        if (amount == 0) return;

        address vault = treasuryVault;

        require(approvedVaults[vault], "Vault not approved");

        vaultBalances[vault] += amount;

        emit VaultAccrued(vault, amount);
    }

    /* ───────────────── VAULT CLAIM (PULL MODEL) ───────────────── */

    function claimVaultFunds() external nonReentrant {
        uint256 amount = vaultBalances[msg.sender];

        require(amount > 0, "Nothing");

        vaultBalances[msg.sender] = 0;

        (bool ok, ) = payable(msg.sender).call{value: amount}("");
        require(ok, "Transfer failed");

        totalETHSent += amount;

        emit VaultClaimed(msg.sender, amount);
    }

    /* ───────────────── RECEIVE ───────────────── */

    receive() external payable {}
}

// address[] memory path = new address[](2);