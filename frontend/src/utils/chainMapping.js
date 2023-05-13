const chainIdToName = {
  1: "mainnet",
  5: "goerli",
  137: "polygon",
  80001: "mumbai",
  43114: "avalanche",
}

const chainIdToExplorerUrl = {
  1: "https://etherscan.io/address/",
  5: "https://goerli.etherscan.io/address/",
  137: "https://polygonscan.com/address/",
  80001: "https://mumbai.polygonscan.com/address/",
  43114: "https://snowtrace.io/address/",
  420: "https://goerli-optimism.etherscan.io/address/",
}

export { chainIdToName, chainIdToExplorerUrl }
