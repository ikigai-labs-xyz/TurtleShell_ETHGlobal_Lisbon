const { expect } = require("chai")
const { network, deployments, ethers, getNamedAccounts } = require("hardhat")
const { constants, networkConfig } = require("../../helper-hardhat-config")

const chainId = network.config.chainId
const contractConfig = networkConfig[chainId].contracts.TurtleShellToken
const contractName = contractConfig.name

!constants.developmentChains.includes(network.name)
	? describe.skip
	: describe(contractName, () => {
			let contract, user, userContract, demoContract, deployer, domain

			beforeEach(async () => {
				deployer = await ethers.getSigner((await getNamedAccounts()).deployer)
				user = await ethers.getSigner((await getNamedAccounts()).user)
				await deployments.fixture(["forTests", "TurtleShellToken"])
				contract = await ethers.getContract(contractName, deployer.address)
				userContract = await ethers.getContract(contractName, user.address)
				demoContract = await ethers.getContract("DemoContract", deployer.address)

				domain = {
					name: contractConfig.args.name,
					version: "1",
					chainId: chainId,
					verifyingContract: contract.address,
				}
			})

			describe("mint", () => {
				let mintRequest, mintRequestTypes, faultyMintSignature, demoIpfsHash, rawContractType, contractType, grade
				beforeEach(async () => {
					mintRequestTypes = {
						MintRequest: [
							{ name: "to", type: "address" },
							{ name: "tokenURI", type: "string" },
							{ name: "grade", type: "uint256" },
							{ name: "contractType", type: "bytes32" },
						],
					}

					demoIpfsHash = "ipfs://someDemoHash"

					rawContractType = "testContractType"
					const contractTypeBytes = ethers.utils.toUtf8Bytes(rawContractType)
					contractType = ethers.utils.keccak256(contractTypeBytes)

					grade = 1000

					mintRequest = {
						to: demoContract.address,
						tokenURI: demoIpfsHash,
						grade,
						contractType,
					}

					mintSignature = await deployer._signTypedData(domain, mintRequestTypes, mintRequest)
					faultyMintSignature = await user._signTypedData(domain, mintRequestTypes, mintRequest)
				})
				it("can only be called with valid signature", async () => {
					await expect(userContract.mint(mintRequest, faultyMintSignature)).to.be.revertedWith(
						"TurtleShellToken__InvalidSignature()"
					)
				})
				it("reverts if signature has already been used", async () => {
					await userContract.mint(mintRequest, mintSignature)
					await expect(userContract.mint(mintRequest, mintSignature)).to.be.revertedWith(
						`TurtleShellToken__SignatureAlreadyUsed()`
					)
				})
				it("reverts if using invalid grade", async () => {
					mintRequest.grade = 2001
					const newMintSignature = await deployer._signTypedData(domain, mintRequestTypes, mintRequest)
					await expect(userContract.mint(mintRequest, newMintSignature)).to.be.revertedWith(
						`TurtleShellToken__InvalidGrade()`
					)
				})
				it("mints to the contract address", async () => {
					await userContract.mint(mintRequest, mintSignature)

					const owner = await userContract.ownerOf(1)
					expect(owner).to.equal(demoContract.address)
				})
				it("stores token data correctly", async () => {
					await userContract.mint(mintRequest, mintSignature)

					const tokenData = await userContract.getBadgeData(1)
					expect(tokenData.grade).to.equal(grade)
					expect(tokenData.contractType).to.equal(contractType)
				})
				it("stores token URI at correct token Id", async () => {
					const secondDemoIpfsHash = "ifps://secondDemoHash"

					const secondMintRequest = {
						to: demoContract.address,
						tokenURI: secondDemoIpfsHash,
						grade,
						contractType,
					}
					const secondMintSignature = deployer._signTypedData(domain, mintRequestTypes, secondMintRequest)

					await userContract.mint(mintRequest, mintSignature)
					await userContract.mint(secondMintRequest, secondMintSignature)

					const firstUri = await userContract.tokenURI(1)
					expect(firstUri).to.equal(demoIpfsHash)

					const secondUri = await userContract.tokenURI(2)
					expect(secondUri).to.equal(secondDemoIpfsHash)
				})
				it("maps and stores address to tokenId", async () => {
					await userContract.mint(mintRequest, mintSignature)

					const tokenId = await userContract.getTokenIdOfOwner(demoContract.address)
					expect(tokenId).to.equal(1)
				})
				it("emits event correctly", async () => {
					await expect(userContract.mint(mintRequest, mintSignature)).to.emit(userContract, "Locked").withArgs(1)
				})
			})
	  })
