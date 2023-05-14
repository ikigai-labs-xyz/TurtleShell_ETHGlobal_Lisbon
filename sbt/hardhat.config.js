require("dotenv").config()

require("@nomiclabs/hardhat-etherscan")
require("@nomiclabs/hardhat-waffle")
require("hardhat-gas-reporter")
require("hardhat-contract-sizer")
require("solidity-coverage")
require("hardhat-deploy")
require("@primitivefi/hardhat-dodoc")

const MUMBAI_RPC_URL = process.env.RPC_URL !== undefined ? process.env.RPC_URL.replace("network", "polygon-mumbai") : ""
const MUMBAI_PRIVATE_KEY = process.env.MUMBAI_PRIVATE_KEY !== undefined ? process.env.MUMBAI_PRIVATE_KEY : ""
const MUMBAI_EXPLORER_API_KEY = process.env.MUMBAI_EXPLORER_API_KEY

const OPTIMISM_GOERLI_RPC_URL =
	process.env.RPC_URL !== undefined ? process.env.RPC_URL.replace("network", "opt-goerli") : ""
const OPTIMISM_GOERLI_PRIVATE_KEY =
	process.env.OPTIMISM_GOERLI_PRIVATE_KEY !== undefined ? process.env.OPTIMISM_GOERLI_PRIVATE_KEY : ""
const OPTIMISM_GOERLI_EXPLORER_API_KEY = process.env.OPTIMISM_GOERLI_EXPLORER_API_KEY

const LINEA_RPC_URL = "https://rpc.goerli.linea.build"
const LINEA_PRIVATE_KEY = process.env.LINEA_PRIVATE_KEY !== undefined ? process.env.LINEA_PRIVATE_KEY : ""
const LINEA_EXPLORER_API_KEY = process.env.LINEA_EXPLORER_API_KEY

const ZKEVM_RPC_URL =
	process.env.RPC_URL !== undefined ? process.env.RPC_URL.replace("network", "polygonzkevm-testnet") : ""
const ZKEVM_PRIVATE_KEY = process.env.ZKEVM_PRIVATE_KEY !== undefined ? process.env.ZKEVM_PRIVATE_KEY : ""
const ZKEVM_EXPLOER_API_KEY = process.env.ZKEVM_EXPLOER_API_KEY

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
		mumbai: {
			chainId: 80001,
			blockConfirmations: 6,
			url: MUMBAI_RPC_URL,
			accounts: [MUMBAI_PRIVATE_KEY],
		},
		"opt-goerli": {
			chainId: 420,
			blockConfirmations: 6,
			url: OPTIMISM_GOERLI_RPC_URL,
			accounts: [OPTIMISM_GOERLI_PRIVATE_KEY],
		},
		linea: {
			chainId: 59140,
			blockConfirmations: 6,
			url: LINEA_RPC_URL,
			accounts: [LINEA_PRIVATE_KEY],
		},
		zkevm: {
			chainId: 1442,
			blockConfirmations: 6,
			url: ZKEVM_RPC_URL,
			accounts: [ZKEVM_PRIVATE_KEY],
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
			polygonMumbai: MUMBAI_EXPLORER_API_KEY,
			"opt-goerli": OPTIMISM_GOERLI_EXPLORER_API_KEY,
			linea: LINEA_EXPLORER_API_KEY,
		},
		customChains: [
			{
				network: "opt-goerli",
				chainId: 420,
				urls: {
					apiURL: "https://api-goerli-optimism.etherscan.io/api",
					browserURL: "https://api-goerli-optimism.etherscan.io",
				},
			},
			{
				network: "linea",
				chainId: 59140,
				urls: {
					apiURL: "https://explorer.goerli.linea.build/api",
					browserURL: "https://explorer.goerli.linea.build",
				},
			},
		],
	},
	dodoc: {
		runOnCompile: false,
		exclude: [],
	},
	mocha: {
		timeout: 300000,
	},
}
