// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/**
 * @title AuthiChainNFT
 * @notice ERC-721 Certificate of Authenticity NFT for AuthiChain products.
 *         Each token is bound to a unique TrueMark™ product ID and carries
 *         on-chain metadata (product name, brand, issuance timestamp).
 *
 *         Compatible with VeChain EVM (Thor) and any EVM-compatible chain.
 *         VIP-181 is VeChain's NFT standard, which mirrors ERC-721; this
 *         contract satisfies both interfaces.
 */
contract AuthiChainNFT is ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;

    // ─── Storage ──────────────────────────────────────────────────────────────

    Counters.Counter private _tokenIdCounter;

    // Mapping: truemarkId (bytes32) → tokenId
    mapping(bytes32 => uint256) public truemarkToToken;

    // Mapping: tokenId → on-chain metadata
    mapping(uint256 => CertificateData) public certificates;

    // Authorised minters (AuthiChain backend signers)
    mapping(address => bool) public authorisedMinters;

    // ─── Structs ──────────────────────────────────────────────────────────────

    struct CertificateData {
        string  truemarkId;   // e.g. "TM-1234567890-ABC12345"
        string  productName;
        string  brand;
        string  plan;         // "professional" | "enterprise"
        uint256 issuedAt;     // block.timestamp
        address issuedTo;     // initial owner
    }

    // ─── Events ───────────────────────────────────────────────────────────────

    event CertificateMinted(
        uint256 indexed tokenId,
        address indexed recipient,
        string  truemarkId,
        string  productName,
        string  brand
    );

    event MinterUpdated(address indexed minter, bool authorised);

    // ─── Errors ───────────────────────────────────────────────────────────────

    error NotAuthorisedMinter();
    error TruemarkAlreadyMinted(string truemarkId);
    error EmptyTruemarkId();

    // ─── Constructor ──────────────────────────────────────────────────────────

    constructor(address initialOwner)
        ERC721("AuthiChain Certificate of Authenticity", "AUTHICOA")
        Ownable(initialOwner)
    {}

    // ─── Modifiers ────────────────────────────────────────────────────────────

    modifier onlyMinter() {
        if (!authorisedMinters[msg.sender] && msg.sender != owner()) {
            revert NotAuthorisedMinter();
        }
        _;
    }

    // ─── Admin ────────────────────────────────────────────────────────────────

    /**
     * @notice Grant or revoke minting rights for a backend signer address.
     */
    function setMinter(address minter, bool status) external onlyOwner {
        authorisedMinters[minter] = status;
        emit MinterUpdated(minter, status);
    }

    // ─── Mint ─────────────────────────────────────────────────────────────────

    /**
     * @notice Mint a Certificate of Authenticity NFT.
     * @param recipient    Wallet address receiving the NFT (brand or end-consumer).
     * @param truemarkId   AuthiChain TrueMark™ ID string (must be unique).
     * @param productName  Human-readable product name.
     * @param brand        Brand name.
     * @param plan         Subscription plan tier ("professional" | "enterprise").
     * @param metadataURI  IPFS / HTTPS URI pointing to the full JSON metadata.
     * @return tokenId     The newly minted token ID.
     */
    function mintCertificate(
        address recipient,
        string calldata truemarkId,
        string calldata productName,
        string calldata brand,
        string calldata plan,
        string calldata metadataURI
    ) external onlyMinter returns (uint256 tokenId) {
        if (bytes(truemarkId).length == 0) revert EmptyTruemarkId();

        bytes32 key = keccak256(bytes(truemarkId));
        if (truemarkToToken[key] != 0) revert TruemarkAlreadyMinted(truemarkId);

        _tokenIdCounter.increment();
        tokenId = _tokenIdCounter.current();

        _safeMint(recipient, tokenId);
        _setTokenURI(tokenId, metadataURI);

        truemarkToToken[key] = tokenId;
        certificates[tokenId] = CertificateData({
            truemarkId:  truemarkId,
            productName: productName,
            brand:       brand,
            plan:        plan,
            issuedAt:    block.timestamp,
            issuedTo:    recipient
        });

        emit CertificateMinted(tokenId, recipient, truemarkId, productName, brand);
    }

    // ─── View ─────────────────────────────────────────────────────────────────

    /**
     * @notice Look up a token ID by TrueMark™ ID.
     * @return tokenId (0 if not minted).
     */
    function tokenByTruemark(string calldata truemarkId) external view returns (uint256) {
        return truemarkToToken[keccak256(bytes(truemarkId))];
    }

    /**
     * @notice Total supply of minted certificates.
     */
    function totalSupply() external view returns (uint256) {
        return _tokenIdCounter.current();
    }

    /**
     * @notice ERC-165 interface support (VeChain / marketplaces check this).
     */
    function supportsInterface(bytes4 interfaceId)
        public view override(ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
