const chainIdToName = {
  1: "mainnet",
  5: "goerli",
  137: "polygon",
  80001: "mumbai",
  43114: "avalanche",
}

const chainIdToExplorerUrl = {
  1: "https://etherscan.io",
  5: "https://goerli.etherscan.io",
  137: "https://polygonscan.com",
  80001: "https://mumbai.polygonscan.com",
  43114: "https://snowtrace.io",
  420: "https://goerli-optimism.etherscan.io",
}

export { chainIdToName, chainIdToExplorerUrl }
