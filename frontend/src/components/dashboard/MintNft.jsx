import ContractCard, { CardType } from "./ContractCard"
import Spinner from "../Spinner"

export default function MintNft({ contract, loading, mintNft, score }) {
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
        {loading && <Spinner />}

        <ContractCard
          isSelected={true}
          setSelectedContract={null}
          contract={contract}
          cardType={CardType.onMint}
          grade={score}
        />
      </div>

      <div className="text-center">
        <button
          onClick={() => mintNft()}
          className={`px-4 py-2 mb-3 text-sm font-semibold bg-gradient-to-br from-[#5C2C69] to-#2C4C84 border-transparent rounded-full w-fit text-[#C2C2C2]`}
        >
          {loading ? <Spinner /> : "Mint Badge"}
        </button>
      </div>
    </>
  )
}
