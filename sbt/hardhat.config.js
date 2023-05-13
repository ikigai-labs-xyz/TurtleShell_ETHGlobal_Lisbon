require("dotenv").config()

require("@nomiclabs/hardhat-etherscan")
require("@nomiclabs/hardhat-waffle")
require("hardhat-gas-reporter")
require("hardhat-contract-sizer")
require("solidity-coverage")
require("hardhat-deploy")
require("@primitivefi/hardhat-dodoc")

const GOERLI_RPC_URL = process.env.RPC_URL !== undefined ? process.env.RPC_URL.replace("network", "goerli") : ""
const GOERLI_RPIVATE_KEY = process.env.GOERLI_PRIVATE_KEY !== undefined ? process.env.GOERLI_PRIVATE_KEY : ""
const GOERLI_EXPLORER_API_KEY = process.env.GOERLI_EXPLORER_API_KEY

const MUMBAI_RPC_URL = process.env.RPC_URL !== undefined ? process.env.RPC_URL.replace("network", "polygon-mumbai") : ""
const MUMBAI_PRIVATE_KEY = process.env.MUMBAI_PRIVATE_KEY !== undefined ? process.env.MUMBAI_PRIVATE_KEY : ""
const MUMBAI_EXPLORER_API_KEY = process.env.MUMBAI_EXPLORER_API_KEY

const COINMARKETCAP_API_KEY = process.env.COINMARKETCAP_API_KEY
const REPORT_GAS = process.env.REPORT_GAS

module.exports = {
	solidity: {
		version: "0.8.9",
		defaultNetwork: "hardhat",
		// compilers: [{ version: "0.8.13", settings: { optimizer: { enabled: true, runs: 200 } } }],
		settings: {
			optimizer: {
				// => optimizer makes contract sizes smaller
				enabled: true,
				runs: 200,
			},
		},
	},
	networks: {
		hardhat: {
			chainId: 31337,
			blockConfirmations: 1,
		},
		localhost: {
			chainId: 31337,
			blockConfirmations: 1,
		},
		goerli: {
			chainId: 5,
			blockConfirmations: 6,
			url: GOERLI_RPC_URL,
			accounts: [GOERLI_RPIVATE_KEY],
		},
		mumbai: {
			chainId: 80001,
			blockConfirmations: 6,
			url: MUMBAI_RPC_URL,
			accounts: [MUMBAI_PRIVATE_KEY],
		},
	},
	namedAccounts: {
		deployer: {
			default: 0,
		},
		user: {
			default: 1,
		},
	},
	gasReporter: {
		enabled: REPORT_GAS,
		outputFile: "gas-report.txt",
		noColors: true,
		currency: "USD",
		coinmarketcap: COINMARKETCAP_API_KEY,
		// token: "MATIC",
		excludeContracts: [],
	},
	etherscan: {
		apiKey: {
			goerli: GOERLI_EXPLORER_API_KEY,
			polygonMumbai: MUMBAI_EXPLORER_API_KEY,
			// aurora: "",
		},
		// customChains: [
		// 	{
		// 		network: "aurora",
		// 		chainId: 1313161555,
		// 		urls: {
		// 			apiURL: "https://explorer.testnet.aurora.dev/api",
		// 			browserURL: "https://explorer.testnet.aurora.dev",
		// 		},
		// 	},
		// ],
	},
	dodoc: {
		runOnCompile: false,
		exclude: [],
	},
	mocha: {
		timeout: 300000,
	},
}
