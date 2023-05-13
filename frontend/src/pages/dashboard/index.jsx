import { ethers } from "ethers"
import { useState } from "react"
import NavBar from "../../components/dashboard/Navbar"
import PerformAudit from "../../dashboard/PerformAudit"
import useGetContracts from "../../hooks/useGetContractsOfWalletAddress"
import {
  getAuditsOfContract,
  getBackendSignature,
  getContractType,
  getScoreOfContract,
  getSourceCodeOfContract,
  uploadToIpfs,
} from "../../utils/api"
import { turtleContract } from "../../utils/contracts"

const PageState = {
  performAudit: "performAudit",
  mintNft: "mintNft",
}

export default function Dashboard() {
  const [pageState, setPageState] = useState(PageState.performAudit)

  const [selectedContract, setSelectedContract] = useState({
    address: ethers.constants.AddressZero,
    chain: 5,
  })
  const [loading, setLoading] = useState(false)
  const [audits, setAudits] = useState("")
  const [score, setScore] = useState("")
  const [contractType, setContractType] = useState("")

  const { loading: getContractsLoading, contracts } = useGetContracts(
    "0x4bFC74983D6338D3395A00118546614bB78472c2"
  )

  async function performAudit(selectedContract, retryCount = 0) {
    if (!selectedContract) return

    try {
      setLoading(true)

      const sourceCode = getSourceCodeOfContract(
        selectedContract.address,
        selectedContract.chain
      )

      const [audits, score, contractType] = await Promise.all([
        getAuditsOfContract(selectedContract),
        getScoreOfContract(selectedContract),
        getContractType(sourceCode),
      ])

      if (
        !audits ||
        typeof audits !== "string" ||
        !score ||
        typeof score !== "string" ||
        !contractType ||
        typeof contractType !== "string"
      ) {
        if (retryCount < 3) {
          console.log(
            `Failed to retrieve audits or score, trying again retry count ${++retryCount}`
          )
          performAudit(selectedContract, ++retryCount)
        }
        throw new Error("Failed to retrieve audits or score")
      }

      setPageState(PageState.mintNft)
    } catch (error) {
      console.error(`performAudit error: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  async function onMint(selectedContract, retryCount = 0) {
    if (!selectedContract || !score || !audits || !contractType) return

    try {
      setLoading(true)

      const signature = await getBackendSignature(
        selectedContract.chain,
        selectedContract.address,
        ipfsCid,
        score,
        contractType
      )

      if (!signature || typeof signature !== "string") {
        if (retryCount < 3) {
          console.log(
            `Failed to retrieve signature, trying again retry count ${++retryCount}`
          )
          onMint(selectedContract, ++retryCount)
        }
        throw new Error("Failed to retrieve signature")
      }

      const ipfsData = JSON.stringify({ audits, score, contractType })
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

      const tx = turtleContract.mint(signature)

      await tx.wait()
    } catch (error) {
      console.error(`onMint error: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  function renderContent() {
    let content = ""
    switch (pageState) {
      case PageState.performAudit:
        content = (
          <PerformAudit
            getContractsLoading={getContractsLoading}
            contracts={contracts}
            setSelectedContract={setSelectedContract}
            selectedContract={selectedContract}
            performAudit={performAudit}
            loading={loading}
          />
        )
        break

      case PageState.mintNft:
        content = (
          <>
            <div className="w-full items-center justify-between mb-4">
              <h2 className="flex w-full justify-center text-center font-bold leading-[3rem] text-[#DBDBDB] text-4xl">
                Congrats! 🎉
              </h2>

              <div>The AI model has scanned your contract.</div>
              <div>Mint your security badge now.</div>
            </div>
          </>
        )
    }

    return content
  }

  return (
    <div className="h-screen w-screen bg-app-bg">
      <NavBar />

      <main className="bg-[#0B0C15] flex min-h-screen flex-col items-center justify-between p-24">
        {renderContent()}
      </main>
    </div>
  )
}
