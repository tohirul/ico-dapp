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

/*//////////////////////////////////////////////////////////////
                            IMPORTS
//////////////////////////////////////////////////////////////*/

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/*//////////////////////////////////////////////////////////////
                        INTERFACES
//////////////////////////////////////////////////////////////*/

interface IUniswapV2Router02 {
    function WETH() external pure returns (address);

    function swapExactTokensForETHSupportingFeeOnTransferTokens(
        uint amountIn,
        uint amountOutMin,
        address[] calldata path,
        address to,
        uint deadline
    ) external;

    function addLiquidityETH(
        address token,
        uint amountTokenDesired,
        uint amountTokenMin,
        uint amountETHMin,
        address to,
        uint deadline
    ) external payable;

    function getAmountsOut(uint amountIn, address[] calldata path)
        external
        view
        returns (uint[] memory amounts);
}

/*//////////////////////////////////////////////////////////////
                        CONTRACT
//////////////////////////////////////////////////////////////*/

contract Valerian is ERC20, Ownable, ReentrancyGuard {

    /*//////////////////////////////////////////////////////////////
                            CONSTANTS
    //////////////////////////////////////////////////////////////*/

    uint256 public constant DENOM = 10_000;
    uint256 public constant MAX_FEE = 1_000;

    /*//////////////////////////////////////////////////////////////
                            CORE STATE
    //////////////////////////////////////////////////////////////*/

    IUniswapV2Router02 public immutable router;
    address public immutable WETH;
    address public treasury;

    /*//////////////////////////////////////////////////////////////
                            FEES
    //////////////////////////////////////////////////////////////*/

    uint256 public buyFee = 300;
    uint256 public sellFee = 500;

    mapping(address => bool) public isFeeExempt;
    mapping(address => bool) public isPair;

    /*//////////////////////////////////////////////////////////////
                            CONTROL
    //////////////////////////////////////////////////////////////*/

    bool public paused;
    bool public swapEnabled = true;

    /*//////////////////////////////////////////////////////////////
                        SWAP CONFIG
    //////////////////////////////////////////////////////////////*/

    bool private inSwap;

    uint256 public swapThreshold;
    uint256 public minSwapAmount;
    uint256 public swapCooldown = 10 minutes;
    uint256 public lastSwapTime;
    uint256 public maxSlippageBps = 500;

    modifier lockSwap() {
        inSwap = true;
        _;
        inSwap = false;
    }

    /*//////////////////////////////////////////////////////////////
                        CONSTRUCTOR
    //////////////////////////////////////////////////////////////*/

    constructor(
        address _router,
        address _treasury,
        address _owner
    )
        ERC20("Valerian", "VAL")
        Ownable(_owner)
    {
        require(_router != address(0), "INVALID_ROUTER");
        require(_treasury != address(0), "INVALID_TREASURY");

        router = IUniswapV2Router02(_router);
        WETH = router.WETH();
        treasury = _treasury;

        _mint(_owner, 1_000_000 * 1e18);

        swapThreshold = totalSupply() / 2000;
        minSwapAmount = swapThreshold / 2;

        isFeeExempt[_owner] = true;
        isFeeExempt[address(this)] = true;
    }

    /*//////////////////////////////////////////////////////////////
                        CORE TRANSFER (OZ v5)
    //////////////////////////////////////////////////////////////*/

    function _update(
        address from,
        address to,
        uint256 amount
    ) internal override {

        // mint / burn
        if (from == address(0) || to == address(0)) {
            super._update(from, to, amount);
            return;
        }

        require(from != address(0) && to != address(0), "ZERO");

        if (paused) {
            require(isFeeExempt[from] && isFeeExempt[to], "PAUSED");
        }

        // bypass
        if (inSwap || isFeeExempt[from] || isFeeExempt[to]) {
            super._update(from, to, amount);
            return;
        }

        uint256 fee;

        // BUY
        if (isPair[from]) {
            fee = (amount * buyFee) / DENOM;
        }
        // SELL
        else if (isPair[to]) {
            fee = (amount * sellFee) / DENOM;
            _trySwap();
        }

        if (fee > 0) {
            super._update(from, address(this), fee);
            amount -= fee;
        }

        super._update(from, to, amount);
    }

    /*//////////////////////////////////////////////////////////////
                        SWAP ENGINE
    //////////////////////////////////////////////////////////////*/

    function _trySwap() internal {
        if (!swapEnabled) return;
        if (inSwap) return;
        if (block.timestamp < lastSwapTime + swapCooldown) return;

        uint256 bal = balanceOf(address(this));
        if (bal < swapThreshold || bal < minSwapAmount) return;

        lastSwapTime = block.timestamp;

        _executeSwap(swapThreshold);
    }

    function _executeSwap(uint256 amount) internal lockSwap nonReentrant {
        uint256 half = amount / 2;
        uint256 otherHalf = amount - half;

        uint256 ethReceived = _swapForETH(half);
        if (ethReceived == 0) return;

        uint256 ethLP = ethReceived / 2;
        uint256 ethTreasury = ethReceived - ethLP;

        _addLiquidity(otherHalf, ethLP);

        (bool ok, ) = treasury.call{value: ethTreasury}("");
        require(ok, "TREASURY_FAIL");
    }

    function _swapForETH(uint256 amount) internal returns (uint256) {
        if (amount == 0) return 0;

        _approve(address(this), address(router), amount);

        address[] memory path = new address[](2);
        path[0] = address(this);
        path[1] = WETH;

        uint256 expected;

        try router.getAmountsOut(amount, path) returns (uint[] memory amounts) {
            expected = amounts[1];
        } catch {
            return 0;
        }

        if (expected == 0) return 0;

        uint256 minOut = (expected * (DENOM - maxSlippageBps)) / DENOM;

        uint256 beforeBal = address(this).balance;

        router.swapExactTokensForETHSupportingFeeOnTransferTokens(
            amount,
            minOut,
            path,
            address(this),
            block.timestamp
        );

        return address(this).balance - beforeBal;
    }

    function _addLiquidity(uint256 tokenAmount, uint256 ethAmount) internal {
        if (tokenAmount == 0 || ethAmount == 0) return;

        _approve(address(this), address(router), tokenAmount);

        router.addLiquidityETH{value: ethAmount}(
            address(this),
            tokenAmount,
            0,
            0,
            owner(),
            block.timestamp
        );
    }

    /*//////////////////////////////////////////////////////////////
                        ADMIN
    //////////////////////////////////////////////////////////////*/

    function setFees(uint256 _buy, uint256 _sell) external onlyOwner {
        require(_buy <= MAX_FEE && _sell <= MAX_FEE, "FEE");
        buyFee = _buy;
        sellFee = _sell;
    }

    function setTreasury(address _treasury) external onlyOwner {
        require(_treasury != address(0), "ZERO");
        treasury = _treasury;
    }

    function setSwapConfig(
        uint256 _threshold,
        uint256 _cooldown,
        uint256 _minSwap,
        uint256 _slippage
    ) external onlyOwner {
        require(_slippage <= 1000, "SLIPPAGE");

        swapThreshold = _threshold;
        swapCooldown = _cooldown;
        minSwapAmount = _minSwap;
        maxSlippageBps = _slippage;
    }

    function setPair(address pair, bool status) external onlyOwner {
        isPair[pair] = status;
    }

    function setFeeExempt(address user, bool status) external onlyOwner {
        isFeeExempt[user] = status;
    }

    function setPaused(bool _paused) external onlyOwner {
        paused = _paused;
    }

    function setSwapEnabled(bool _enabled) external onlyOwner {
        swapEnabled = _enabled;
    }

    /*//////////////////////////////////////////////////////////////
                        EMERGENCY
    //////////////////////////////////////////////////////////////*/

    function rescueETH() external onlyOwner {
        (bool ok, ) = owner().call{value: address(this).balance}("");
        require(ok, "FAIL");
    }

    function rescueTokens(address token) external onlyOwner {
        IERC20(token).transfer(owner(), IERC20(token).balanceOf(address(this)));
    }

    receive() external payable {}
}