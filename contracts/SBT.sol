// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract SoulboundToken is ERC721, Ownable {
    uint256 private _tokenIdCounter;
    mapping(address => bool) public hasMinted;
    mapping(uint256 => string) private _tokenURIs;
    mapping(address => bool) public daoSigners;

    // Predefined DAO authorized wallets (initial ones)
    address[] public authorizedDAOWallets = [
        0x7dfaD7deD1B3351D8BA46703b47296056688c664,
        0x476E2651BF97dE8a26e4A05a9c8e00A6EFa1390c,
        0x357438e4Df52288a137B955E3401E9C1EAf8AF17,
        0x2AeD14FE7bd056212cD0eD91b57a8EC5A5E33624,
        0xc7F32185E5c15b5D9Da51d70b2816467665BA452
    ];

    constructor(address initialOwner)
        ERC721("DAO Constitutional Membership", "CELOEU-SBT")
        Ownable(initialOwner)
    {}

    /// DAO setup: owner sets who can act as DAO signer
    function setDAO(address signer, bool approved) external onlyOwner {
        daoSigners[signer] = approved;
    }

    /// Modifier to protect transfer function
    modifier onlyDAO() {
        bool isAuthorized = false;
        for (uint i = 0; i < authorizedDAOWallets.length; i++) {
            if (daoSigners[authorizedDAOWallets[i]] == true) {
                isAuthorized = true;
                break;
            }
        }
        require(isAuthorized, "Not an authorized DAO signer");
        _;
    }

    /// Mint one soulbound token per address
    function mint(address to, string memory metaURI) public onlyOwner {
        require(!hasMinted[to], "Already minted");

        uint256 tokenId = _tokenIdCounter;
        _safeMint(to, tokenId);
        _tokenURIs[tokenId] = metaURI;
        hasMinted[to] = true;
        _tokenIdCounter++;
    }

    /// DAO-only manual transfer (wallet recovery, reassignment)
    function daoTransfer(address from, address to, uint256 tokenId) external onlyDAO {
        _transfer(from, to, tokenId);
    }

    /// Metadata
    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(_ownerOf(tokenId) != address(0), "Nonexistent token");
        return _tokenURIs[tokenId];
    }

    /// Disable public transfer/approval routes
    function approve(address, uint256) public pure override {
        revert("SoulboundToken: Approvals disabled");
    }

    function setApprovalForAll(address, bool) public pure override {
        revert("SoulboundToken: Approvals disabled");
    }

    function getApproved(uint256) public pure override returns (address) {
        return address(0);
    }

    function isApprovedForAll(address, address) public pure override returns (bool) {
        return false;
    }

    /// Burn function to remove a soulbound token
    function burn(uint256 tokenId) external onlyOwner {
        _burn(tokenId);
        address tokenOwner = ownerOf(tokenId);
        hasMinted[tokenOwner] = false;  // Mark that the address no longer has the token
    }
}
