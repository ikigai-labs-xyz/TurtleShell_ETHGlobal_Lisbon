// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/cryptography/EIP712.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

import "./interfaces/IERC5192.sol";
import "./interfaces/ITurtleShellToken.sol";

error TurtleShellToken__InvalidSignature();
error TurtleShellToken__SignatureAlreadyUsed();
error TurtleShellToken__InvalidGrade();

/**
 * @title TurtleShellToken
 * @author Philipp Keinberger
 * @notice Non-Transferable-Token that allows for minting Security Badges.
 */
contract TurtleShellToken is ITurtleShellToken, ERC721, EIP712, IERC5192, Ownable {
	using Counters for Counters.Counter;
	using ECDSA for bytes32;
	Counters.Counter private s_tokenIds;

	struct MintRequest {
		address to;
		string tokenURI;
		uint256 grade;
		bytes32 contractType;
	}

	bytes32 private constant MINTREQUEST_TYPEHASH =
		keccak256("MintRequest(address to,string tokenURI,uint256 grade,bytes32 contractType)");

	uint8 private constant GRADE_DECIMALS = 3;

	/// @dev signature => already used
	mapping(bytes => bool) s_usedSignatures;

	mapping(uint256 => TokenData) s_tokenData;

	mapping(address => uint256) s_ownerToTokenId;

	constructor(string memory name, string memory symbol) ERC721(name, symbol) EIP712(name, "1") {}

	function mint(MintRequest memory mintRequest, bytes memory signature) external {
		if (!_verifyMintRequest(mintRequest, signature, owner())) {
			revert TurtleShellToken__InvalidSignature();
		}
		if (s_usedSignatures[signature]) {
			revert TurtleShellToken__SignatureAlreadyUsed();
		}
		if (mintRequest.grade > 2000) {
			revert TurtleShellToken__InvalidGrade();
		}

		s_usedSignatures[signature] = true;
		s_tokenIds.increment();

		uint256 tokenId = s_tokenIds.current();
		// store token data
		s_tokenData[tokenId] = TokenData({
			grade: mintRequest.grade,
			contractType: mintRequest.contractType,
			issuer: msg.sender,
			owner: mintRequest.to,
			_tokenURI: abi.encodePacked(mintRequest.tokenURI)
		});

		s_ownerToTokenId[mintRequest.to] = tokenId;

		_mint(mintRequest.to, tokenId);

		emit Locked(tokenId);
	}

	function _verifyMintRequest(
		MintRequest memory mintRequest,
		bytes memory signature,
		address signer
	) internal view returns (bool) {
		return _hashTypedDataV4(keccak256(_encodeMintRequest(mintRequest))).recover(signature) == signer;
	}

	/**
	 * @notice Function for encoding a mint request
	 * @param mintRequest is the mint request data
	 * @return bytes encoded mint request data
	 */
	function _encodeMintRequest(MintRequest memory mintRequest) internal pure returns (bytes memory) {
		return
			abi.encode(
				MINTREQUEST_TYPEHASH,
				mintRequest.to,
				keccak256(abi.encodePacked(mintRequest.tokenURI)),
				mintRequest.grade,
				mintRequest.contractType
			);
	}

	/// @dev GETTER FUNCTIONS

	function decimals() external pure returns (uint8) {
		return GRADE_DECIMALS;
	}

	function locked(uint256 tokenId) external view returns (bool) {
		_requireMinted(tokenId);
		return true;
	}

	function getBadgeData(uint256 tokenId) external view override returns (TokenData memory) {
		_requireMinted(tokenId);
		return s_tokenData[tokenId];
	}

	function getTokenIdOfOwner(address owner) external view override returns (uint256) {
		uint256 balance = balanceOf(owner);
		require(balance > 0, "This address doesn't own any NFTs");

		// Fetch the first NFT id
		uint256 tokenId = s_ownerToTokenId[owner];
		return tokenId;
	}

	/// @dev INTERFACE OVERRIDES

	function supportsInterface(bytes4 interfaceId) public view virtual override(ERC721, IERC165) returns (bool) {
		return interfaceId == type(IERC5192).interfaceId || super.supportsInterface(interfaceId);
	}

	function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
		_requireMinted(tokenId);
		return string(s_tokenData[tokenId]._tokenURI);
	}
}
