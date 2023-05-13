import { ethers } from "ethers"
import { useState } from "react"
import MintNft from "../../components/dashboard/MintNft"
import NavBar from "../../components/dashboard/Navbar"
import PerformAudit from "../../components/dashboard/PerformAudit"
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

      const [audits, contractType] = await Promise.all([
        getAuditsOfContract(sourceCode.data),
        // getContractType(sourceCode.data),
      ])

      // if (audits.status !== 201 || contractType.status !== 201) {
      //   if (retryCount < 3) {
      //     console.log(
      //       `Failed to retrieve audits or contract type, trying again retry count ${++retryCount}`
      //     )
      //     performAudit(selectedContract, ++retryCount)
      //     return
      //   } else {
      //     throw new Error("Failed to retrieve audits or contract type")
      //   }
      // }

      const score = getScoreOfContract(
        audits.data?.map((auditData) => auditData.vulnerabilityType)
      )

      if (!score.status !== 201) {
        if (retryCount < 3) {
          console.log(
            `Failed to retrieve score, trying again retry count ${++retryCount}`
          )
          performAudit(selectedContract, ++retryCount)
        } else {
          throw new Error("Failed to retrieve score")
        }
      }

      setAudits(audits.data)
      setContractType("")
      // setContractType(contractType.data)
      setScore(+score.data / 1e3)

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

      const ipfsData = {
        address: selectedContract.address,
        chain: selectedContract.chain,
        grade: score,
        vulnerabilities: audits?.map(
          (auditData) => auditData.vulnerabilityType
        ),
        contractType,
      }
      const ipfsCid = await uploadToIpfs(ipfsData)

      if (!ipfsCid || typeof ipfsCid !== "string") {
        if (retryCount < 3) {
          console.log(
            `Failed to upload to IPFS, trying again retry count ${++retryCount}`
          )
          onMint(selectedContract, ++retryCount)
        } else {
          throw new Error("Failed to upload to IPFS")
        }
      }

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
        } else {
          throw new Error("Failed to retrieve signature")
        }
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
          <MintNft
            contract={selectedContract}
            loading={loading}
            score={score}
            audits={audits}
            mintNft={onMint}
          />
        )
    }

    return content
  }

  return (
    <div className="h-screen w-screen">
      <NavBar />
      <main className=" flex min-h-screen flex-col items-center justify-between p-24">
        {renderContent()}
      </main>
    </div>
  )
}
