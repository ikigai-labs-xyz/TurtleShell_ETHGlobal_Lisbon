const { ethers } = require("hardhat")

const constants = {
	developmentChains: ["hardhat", "localhost"],
	testNetChains: ["mumbai"],
	disabledVerificationNetworks: ["aurora"],
	NULL_ADDRESS: ethers.constants.AddressZero,
	FRONTEND_FILE_PATH: "",
}

const scriptsConfig = {
	TurtleShell: {
		mint: {
			ipfsHash: "ipfs://QmRPDqxUmXxv7uRZmNZiQZuJp9LibebXqJZkxvShbVpT54",
			contractAddress: "0x560AF63C17406F9Abaf6e95dED8BF7a4E75118Aa",
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
	5: {
		name: "goerli",
		contracts: contractsConfig,
		forTests: [],
	},
	80001: {
		name: "mumbai",
		contracts: contractsConfig,
	},
	1313161555: {
		name: "aurora",
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
