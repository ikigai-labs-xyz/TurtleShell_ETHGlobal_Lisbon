# TurtleShell_ETHGlobal_Lisbon

TurtleShell brings Smart Contract security on-chain, making it interoperable and setting new standards for security in web3.

Link to our [Pitchdeck](https://drive.google.com/file/d/18f82B2VgfmKirCisOrOxeVO52cGQLrVj/view?usp=sharing)

### Description

TurtleShell facilitates the concept of Soul-Bound-Tokens to mint Security-Badges on top of Smart Contracts.

We take security data and put it inside of a standard object format. Since that security data is now on-chain, people and protocols can now use it to make integrations on top of that.

There is an infinite amount of possible integrations, but there are two that we found especially interesting for the hackathon:

Using typed contracts, risk-sensitive protocols (DeFi) may only allow a certain set of Smart Contracts to use their platforms, thereby diminishing the risk of malicious hacking contracts. Think of it as a web3 firewall.

Using security-graded contracts, frontend wallets like Metamask could make integrations, to allow users to specify a certain security standard that dApps have to implement before interacting with them.

### How we built it

Turtleshell uses an on-chain NFT contract, to store security data about Smart Contracts.

The Soul-Bound-Contract is deployed on a multitude of different chains, including zkEVM, Mumbai, Optimism and Linea.

To retrieve Smart Contract security data, we are using an AI tool to facility that. We are also using static-analysis for "typing" kinds of contracts. This data is then composed into a standard JSON format, and put on IPFS. The type and grade are also stored on-chain, to allow for integrations on top of that. We chose not to store the entire object on-chain, because that would cause extreme inefficiency in terms of storage.

For our User Interface, we are using ReactJS (Vite), Tailwind and ethers.js. The user interface lets people run a security check on their deployed Smart Contracts. After that, they are able to put that data on-chain, and mint an SBT on top of their Smart Contract.

We also set up a NestJS backend to fetch a variety of different data from APIs to retrieve source-code data and other information. We also set up endpoints for typing and grading contracts. We also use Infura, Alchemy and other RPC endpoints for blockchain-data.

Since bringing a quantity of security data on-chain is extremely good for indexing, we are using subgraphs to index that data.
