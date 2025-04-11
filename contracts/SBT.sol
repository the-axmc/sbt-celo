// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract SoulboundToken is ERC721, Ownable {
    uint256 private _tokenIdCounter;
    mapping(address => bool) public hasMinted;
    mapping(uint256 => string) private _tokenURIs;
    mapping(address => bool) public daoSigners;

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
        require(daoSigners[msg.sender], "Not authorized DAO signer");
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
}
