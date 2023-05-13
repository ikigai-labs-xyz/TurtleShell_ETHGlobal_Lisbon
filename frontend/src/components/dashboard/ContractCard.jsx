import classNames from "classNames"
import { chainIdToExplorerUrl, chainIdToName } from "../utils/chainMapping"

export default function ContractCard({
  isSelected,
  setSelectedContract,
  contract,
}) {
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

  const explorerUrl = chainIdToExplorerUrl[contract.address]

  return (
    <div
      className={classNames(
        `m-4 p-4 w-[360px] group rounded-lg transition-colors border-4 border-gray-300 bg-gray-100 hover:border-gray-400 hover:bg-gray-300`,
        isSelected && ` border-gray-400 hover:border-gray-500`
      )}
      onClick={
        setSelectedContract
          ? () =>
              setSelectedContract({
                address: contract.address,
                chain: contract.chain,
              })
          : () => {}
      }
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
          {chainName && chainName?.[0]?.toUpperCase?.() + chainName?.slice?.(1)}
        </div>
      </div>

      <div className="mb-4">
        <div>address</div>
        <a
          target="_blank"
          rel="noopener noreferrer"
          href={explorerUrl}
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
          src={isSelected ? "/checkbox_checked.svg" : "/checkbox_unchecked.svg"}
          alt="unchecked checkbox"
          width={48}
          height={48}
        />
      </div>
    </div>
  )
}
