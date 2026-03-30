// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

/* ───────────────── IMPORTS ───────────────── */

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

/* ───────────────── CONTRACT ───────────────── */

contract BELROG is ERC20, AccessControl {

    /* ───────────────── ROLES ───────────────── */

    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    /* ───────────────── SUPPLY CONFIG ───────────────── */

    uint256 public constant INITIAL_SUPPLY = 1_000_000 ether;
    uint256 public constant MAX_SUPPLY = 10_000_000 ether;

    /* ───────────────── EVENTS ───────────────── */

    event Minted(address indexed to, uint256 amount);
    event Burned(address indexed from, uint256 amount);

    /* ───────────────── CONSTRUCTOR ───────────────── */

    constructor() ERC20("BELROG", "BELROG") {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(MINTER_ROLE, msg.sender);

        _mint(msg.sender, INITIAL_SUPPLY);
    }

    /* ───────────────── MINT (CAPPED) ───────────────── */

    function mint(address to, uint256 amount)
        external
        onlyRole(MINTER_ROLE)
    {
        require(to != address(0), "Invalid address");
        require(totalSupply() + amount <= MAX_SUPPLY, "Max supply exceeded");

        _mint(to, amount);

        emit Minted(to, amount);
    }

    /* ───────────────── BURN ───────────────── */

    function burn(uint256 amount) external {
        _burn(msg.sender, amount);

        emit Burned(msg.sender, amount);
    }

    function burnFrom(address account, uint256 amount) external {
        _spendAllowance(account, msg.sender, amount);
        _burn(account, amount);

        emit Burned(account, amount);
    }

    /* ───────────────── VIEW HELPERS ───────────────── */

    function remainingSupply() external view returns (uint256) {
        return MAX_SUPPLY - totalSupply();
    }
}