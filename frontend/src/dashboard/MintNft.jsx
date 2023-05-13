import ContractCard from "../components/dashboard/ContractCard"
import { chainIdToExplorerUrl, chainIdToName } from "../utils/chainMapping"

export default function MintNft({ contract }) {
  return (
    <>
      <div className="w-full items-center justify-between mb-4">
        <h2 className="flex w-full justify-center text-center font-bold leading-[3rem] text-[#DBDBDB] text-4xl">
          Congrats! 🎉
        </h2>

        <div>The AI model has scanned your contract.</div>
        <div>Mint your security badge now.</div>
      </div>

      <div className="mb-4 flex flex-wrap justify-center text-sm">
        <ContractCard
          isSelected={true}
          setSelectedContract={null}
          contract={contract}
        />
      </div>
    </>
  )
}
