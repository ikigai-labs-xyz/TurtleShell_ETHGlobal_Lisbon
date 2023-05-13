import { getContractsOfAddress } from "../utils/api"
import { useEffect, useRef, useState } from "react"
// import { ethers } from "ethers"

export default function useGetContracts(walletAddress) {
  const [loading, setLoading] = useState(false)

  const [contracts, setContracts] = useState([])

  const prevWalletAddress = useRef("")
  useEffect(() => {
    if (walletAddress === prevWalletAddress.current) {
      return
    }

    ;(async () => {
      try {
        prevWalletAddress.current = walletAddress

        setLoading(true)

        const contracts = await getContractsOfAddress(walletAddress)

        if (!contracts || !contracts.data || !Array.isArray(contracts.data)) {
          throw new Error("Failed to get contracts")
        }

        setContracts(contracts.data)
        // setContracts([
        //   {
        //     address: ethers.constants.AddressZero,
        //     chain: "mainnet",
        //     date: new Date().toString(),
        //   },
        //   {
        //     address: ethers.constants.AddressZero + "1",
        //     chain: "avalanche",
        //     date: new Date().toString(),
        //   },
        //   {
        //     address: ethers.constants.AddressZero + "2",
        //     chain: "polygon",
        //     date: new Date().toString(),
        //   },
        // ])
      } catch (error) {
        console.error(`getContractsOfAddress error: ${error.message}`)
      } finally {
        setLoading(false)
      }
    })()
  }, [contracts, walletAddress])

  return {
    loading,
    contracts,
  }
}
