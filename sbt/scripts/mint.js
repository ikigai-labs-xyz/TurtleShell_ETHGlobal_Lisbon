const { network, ethers, getNamedAccounts } = require("hardhat")
const { scriptsConfig, networkConfig } = require("../helper-hardhat-config")

const main = async (ipfsHash, contractAddress) => {
	const chainId = network.config.chainId
	const contractName = networkConfig[chainId].contracts.TurtleShellToken.name
	const contract = await ethers.getContract(contractName)
	const deployer = await ethers.getSigner((await getNamedAccounts()).deployer)

	const mintRequestTypes = {
		MintRequest: [
			{ name: "to", type: "address" },
			{ name: "tokenURI", type: "string" },
			{ name: "grade", type: "uint256" },
			{ name: "contractType", type: "bytes32" },
		],
	}
	const domain = {
		name: contractName,
		version: "1",
		chainId: chainId,
		verifyingContract: contract.address,
	}

	const mintRequest = {
		to: contractAddress,
		tokenURI: ipfsHash,
		grade: 1000,
		contractType: ethers.utils.keccak256(ethers.utils.toUtf8Bytes("testContractType")),
	}

	const mintSignature = await deployer._signTypedData(domain, mintRequestTypes, mintRequest)

	const tx = await contract.mint(mintRequest, mintSignature)
	await tx.wait()
}

main(scriptsConfig.TurtleShell.mint.ipfsHash, scriptsConfig.TurtleShell.mint.contractAddress)
	.then(() => process.exit(0))
	.catch((e) => {
		console.error(e)
		process.exit(1)
	})
