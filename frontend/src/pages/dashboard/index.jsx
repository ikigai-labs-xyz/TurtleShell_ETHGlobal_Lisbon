import classNames from "classNames"
import { ethers } from "ethers"
import { useState } from "react"
import Spinner from "../../components/Spinner"
import NavBar from "../../components/dashboard/Navbar"
import useGetContracts from "../../hooks/useGetContractsOfWalletAddress"
import {
  getAuditsOfContract,
  getScoreOfContract,
  uploadToIpfs,
  getBackendSignature,
} from "../../utils/api"
import chainIdToName from "../../utils/chainIdToName"
import { turtleContract } from "../../utils/contracts"

export default function Dashboard() {
  const [selectedContract, setSelectedContract] = useState(
    ethers.constants.AddressZero
  )
  const [loading, setLoading] = useState(false)

  const { loading: getContractsLoading, contracts } = useGetContracts(
    "0x4bFC74983D6338D3395A00118546614bB78472c2"
  )

  console.log("contracts", contracts)
  // const {
  //   loading: detailsLoading,
  //   audits,
  //   score,
  // } = useGetContractDetails(selectedContract)

  async function onMint(selectedContract, retryCount = 0) {
    if (!selectedContract) return

    try {
      setLoading(true)

      const [audits, score] = await Promise.all([
        getAuditsOfContract(selectedContract),
        getScoreOfContract(selectedContract),
      ])

      if (
        !audits ||
        typeof audits !== "string" ||
        !score ||
        typeof score !== "string"
      ) {
        if (retryCount < 3) {
          console.log(
            `Failed to retrieve audits or score, trying again retry count ${++retryCount}`
          )
          onMint(selectedContract, ++retryCount)
        }
        throw new Error("Failed to retrieve audits or score")
      }

      const ipfsData = JSON.stringify({ audits, score })
      const ipfsCid = await uploadToIpfs(ipfsData)

      if (!ipfsCid || typeof ipfsCid !== "string") {
        if (retryCount < 3) {
          console.log(
            `Failed to upload to IPFS, trying again retry count ${++retryCount}`
          )
          onMint(selectedContract, ++retryCount)
        }
        throw new Error("Failed to upload to IPFS")
      }

      const signature = await getBackendSignature(ipfsCid)

      if (!signature || typeof signature !== "string") {
        if (retryCount < 3) {
          console.log(
            `Failed to retrieve signature, trying again retry count ${++retryCount}`
          )
          onMint(selectedContract, ++retryCount)
        }
        throw new Error("Failed to retrieve signature")
      }

      const tx = turtleContract.mint(signature)

      await tx.wait()
    } catch (error) {
      console.error(`onMint error: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="h-screen w-screen bg-app-bg">
      <NavBar />

      <main className="bg-[#0B0C15] flex min-h-screen flex-col items-center justify-between p-24">
        {/* <ConnectButton /> */}
        <div className="w-full items-center justify-between mb-4">
          <h2 className="flex w-full justify-center text-center font-bold leading-[3rem] text-[#DBDBDB] text-4xl">
            Pick one of your deployed contracts
          </h2>
        </div>

        <div className="mb-4 flex flex-wrap justify-center text-sm">
          {getContractsLoading && <Spinner />}

          {contracts.map((contract) => {
            const isSelected = contract.address === selectedContract

            const chainName = chainIdToName[contract.chain?.toString()]

            const chainImageSrc =
              chainName === "mainnet" || chainName === "goerli"
                ? "/eth_icon.svg"
                : chainName === "polygon" || chainName === "mumbai"
                ? "/polygon_icon.svg"
                : chainName === "avalanche"
                ? "/avalanche_icon.svg"
                : ""
            if (!chainImageSrc) {
              console.warn("No chain image src")
            }

            return (
              <div
                key={`${contract.address}-${contract.chain}`}
                className={classNames(
                  `m-4 p-4 w-[360px] group rounded-lg transition-colors border-4 border-gray-300 bg-gray-100 hover:border-gray-400 hover:bg-gray-300`,
                  isSelected && ` border-gray-400 hover:border-gray-500`
                )}
                onClick={() => setSelectedContract(contract.address)}
              >
                <div className="mb-4 flex items-center font-bold text-xl">
                  <img
                    src={chainImageSrc}
                    alt={`${contract.chain} icon`}
                    width={48}
                    height={48}
                    className="ml-4"
                  />
                  <div className="ml-4">
                    {chainName &&
                      chainName?.[0]?.toUpperCase?.() + chainName?.slice?.(1)}
                  </div>
                </div>

                <div className="mb-4">
                  <div>address</div>
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href={`https://etherscan.io/address/${contract.address}`}
                    className="text-[#3546E0] break-words"
                  >
                    {contract.address}
                  </a>
                </div>

                <div>
                  <div>date deployed</div>
                  {/* {new Date(contract.date).toLocaleString()} */}
                </div>

                <div className="flex justify-center mt-4 cursor-pointer">
                  <img
                    src={
                      isSelected
                        ? "/checkbox_checked.svg"
                        : "/checkbox_unchecked.svg"
                    }
                    alt="unchecked checkbox"
                    width={48}
                    height={48}
                  />
                </div>
              </div>
            )
          })}

          {/* <a
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
          target="_blank"
          rel="noopener noreferrer"
        ></a> */}
        </div>

        <div className="text-center">
          <button
            onClick={() => onMint(selectedContract)}
            className={`px-4 py-2 mb-3 text-sm font-semibold bg-gradient-to-br from-[#5C2C69] to-#2C4C84 border-transparent rounded-full w-fit text-[#C2C2C2]`}
          >
            {loading ? <Spinner /> : "Perform Audit"}
          </button>
        </div>
      </main>
    </div>
  )
}
