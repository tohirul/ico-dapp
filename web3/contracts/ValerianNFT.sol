// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

/*//////////////////////////////////////////////////////////////
                            IMPORTS
//////////////////////////////////////////////////////////////*/

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/*//////////////////////////////////////////////////////////////
                        INTERFACE (ALIGNED)
//////////////////////////////////////////////////////////////*/

interface INFTBoost {
    function getBoost(address user) external view returns (uint256);
}

/*//////////////////////////////////////////////////////////////
                        CONTRACT
//////////////////////////////////////////////////////////////*/

contract ValerianNFT is ERC1155, Ownable, ReentrancyGuard, INFTBoost {

    /*//////////////////////////////////////////////////////////////
                            CONSTANTS
    //////////////////////////////////////////////////////////////*/

    uint256 public constant RECEIPT = 1;

    uint256 public constant BASE_BOOST = 10000;   // 1x
    uint256 public constant MAX_BOOST = 20000;    // 2x

    /*//////////////////////////////////////////////////////////////
                            STORAGE
    //////////////////////////////////////////////////////////////*/

    struct Coupon {
        uint32 boostBps;   // e.g. 12000 = 1.2x
        uint64 expiry;
    }

    uint256 public nextId = 1;

    mapping(uint256 => Coupon) private coupons;
    mapping(address => uint256) private activeCoupon;

    address public staking;

    /*//////////////////////////////////////////////////////////////
                            EVENTS
    //////////////////////////////////////////////////////////////*/

    event CouponMinted(address indexed user, uint256 id, uint256 boost, uint256 expiry);
    event CouponConsumed(address indexed user, uint256 id);
    event CouponInvalidated(address indexed user, uint256 id);
    event CouponReplaced(address indexed user, uint256 oldId, uint256 newId);
    event StakingSet(address staking);

    /*//////////////////////////////////////////////////////////////
                            MODIFIER
    //////////////////////////////////////////////////////////////*/

    modifier onlyStaking() {
        require(msg.sender == staking, "ONLY_STAKING");
        _;
    }

    /*//////////////////////////////////////////////////////////////
                        CONSTRUCTOR
    //////////////////////////////////////////////////////////////*/

    constructor(string memory uri_) ERC1155(uri_) Ownable(msg.sender) {}

    /*//////////////////////////////////////////////////////////////
                        ADMIN
    //////////////////////////////////////////////////////////////*/

    function setStaking(address _staking) external onlyOwner {
        require(_staking != address(0), "ZERO");
        staking = _staking;
        emit StakingSet(_staking);
    }

    /*//////////////////////////////////////////////////////////////
                        INTERNAL CLEAN
    //////////////////////////////////////////////////////////////*/

    function _clear(address user, uint256 id) internal {
        delete activeCoupon[user];
        delete coupons[id];

        if (balanceOf(user, RECEIPT) > 0) {
            _burn(user, RECEIPT, 1);
        }
    }

    /*//////////////////////////////////////////////////////////////
                        MINT (STRICT)
    //////////////////////////////////////////////////////////////*/

    function mintCoupon(
        address user,
        uint32 boostBps,
        uint64 expiry,
        bytes calldata data
    ) external onlyOwner nonReentrant {
        require(user != address(0), "ZERO");
        require(expiry > block.timestamp, "INVALID_EXPIRY");
        require(boostBps >= BASE_BOOST, "INVALID_LOW");
        require(boostBps <= MAX_BOOST, "INVALID_HIGH");

        uint256 oldId = activeCoupon[user];

        if (oldId != 0) {
            _clear(user, oldId);
        }

        uint256 id = nextId++;

        activeCoupon[user] = id;
        coupons[id] = Coupon(boostBps, expiry);

        _mint(user, RECEIPT, 1, data);

        if (oldId != 0) {
            emit CouponReplaced(user, oldId, id);
        }

        emit CouponMinted(user, id, boostBps, expiry);
    }

    /*//////////////////////////////////////////////////////////////
                        CONSUME (STAKING)
    //////////////////////////////////////////////////////////////*/

    function consumeCoupon(address user) external onlyStaking nonReentrant {
        uint256 id = activeCoupon[user];
        if (id == 0) return;

        Coupon memory c = coupons[id];

        if (
            balanceOf(user, RECEIPT) != 1 ||
            c.expiry < block.timestamp
        ) {
            _clear(user, id);
            emit CouponInvalidated(user, id);
            return;
        }

        delete activeCoupon[user];
        delete coupons[id];

        _burn(user, RECEIPT, 1);

        emit CouponConsumed(user, id);
    }

    /*//////////////////////////////////////////////////////////////
                        BOOST VIEW (ALIGNED)
    //////////////////////////////////////////////////////////////*/

    function getBoost(address user) external view override returns (uint256) {
        uint256 id = activeCoupon[user];
        if (id == 0) return BASE_BOOST;

        Coupon memory c = coupons[id];

        if (
            balanceOf(user, RECEIPT) != 1 ||
            c.expiry < block.timestamp
        ) {
            return BASE_BOOST;
        }

        uint256 boost = c.boostBps;

        if (boost < BASE_BOOST) return BASE_BOOST;
        if (boost > MAX_BOOST) return MAX_BOOST;

        return boost;
    }

    /*//////////////////////////////////////////////////////////////
                        NON-TRANSFERABLE
    //////////////////////////////////////////////////////////////*/

    function _update(
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory values
    ) internal override {
        if (from != address(0) && to != address(0)) {
            revert("NON_TRANSFERABLE");
        }
        super._update(from, to, ids, values);
    }
}