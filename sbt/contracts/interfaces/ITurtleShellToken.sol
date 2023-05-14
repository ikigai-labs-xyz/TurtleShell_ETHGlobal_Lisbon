// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

interface ITurtleShellToken {
	struct TokenData {
		uint256 grade;
		bytes32 contractType;
		address issuer;
		address owner;
		bytes _tokenURI;
	}

	function getBadgeData(uint256 tokenId) external view returns (TokenData memory);

	function getTokenIdOfOwner(address owner) external view returns (uint256);
}
