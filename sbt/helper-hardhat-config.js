const { ethers } = require("hardhat")

const constants = {
	developmentChains: ["hardhat", "localhost"],
	testNetChains: ["mumbai"],
	disabledVerificationNetworks: [""],
	NULL_ADDRESS: ethers.constants.AddressZero,
	FRONTEND_FILE_PATH: "",
}

const scriptsConfig = {
	TurtleShell: {
		mint: {
			ipfsHash: "ipfs://QmXuRPceYwgR2VzhJwzikpF7jgAP3tVEGSCX4Axqf777by",
			contractAddress: "0x081E56a6b25C2A42A91996e6Bb655641c101FD99",
			grade: "432",
			contractType: "0x114128cb0f8de650cab6a5e6072b55901972ea7f8b246973f8edc4f09fd8d343",
		},
	},
}

const contractsConfig = {
	TurtleShellToken: {
		name: "TurtleShellToken",
		args: {
			name: "TurtleShellToken",
			symbol: "TST",
		},
	},
}

const networkConfig = {
	80001: {
		name: "mumbai",
		contracts: contractsConfig,
	},
	420: {
		name: "opt-goerli",
		contracts: contractsConfig,
	},
	59140: {
		name: "linea",
		contracts: contractsConfig,
	},
	1442: {
		name: "zkevm",
		contracts: contractsConfig,
	},
	31337: {
		name: "hardhat",
		contracts: contractsConfig,
		forTests: [{ name: "DemoContract", args: [] }],
	},
}

module.exports = {
	constants,
	scriptsConfig,
	networkConfig,
}
