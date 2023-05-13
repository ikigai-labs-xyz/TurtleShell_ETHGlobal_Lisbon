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
			ipfsHash: "ipfs://testHash",
			contractAddress: "0x4e8EbD8f1225A01335Fcd851898df60555A36e17",
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
