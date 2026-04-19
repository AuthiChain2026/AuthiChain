// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * $QRON — The truth economy token.
 *
 * 1B total supply. Minter role for the AuthiChain backend
 * to distribute scan rewards. Brands purchase $QRON to fund
 * their reward pools, creating real token demand.
 */
contract QRONToken is ERC20, Ownable {
    uint256 public constant MAX_SUPPLY = 1_000_000_000 * 10 ** 18; // 1B
    mapping(address => bool) public minters;

    event MinterUpdated(address indexed account, bool isMinter);

    constructor() ERC20("QRON", "QRON") Ownable(msg.sender) {
        // Mint initial treasury allocation (20%) to deployer
        _mint(msg.sender, 200_000_000 * 10 ** 18);
    }

    modifier onlyMinter() {
        require(minters[msg.sender] || msg.sender == owner(), "Not a minter");
        _;
    }

    function setMinter(address account, bool _isMinter) external onlyOwner {
        minters[account] = _isMinter;
        emit MinterUpdated(account, _isMinter);
    }

    function mint(address to, uint256 amount) external onlyMinter {
        require(totalSupply() + amount <= MAX_SUPPLY, "Exceeds max supply");
        _mint(to, amount);
    }

    function burn(uint256 amount) external {
        _burn(msg.sender, amount);
    }
}
