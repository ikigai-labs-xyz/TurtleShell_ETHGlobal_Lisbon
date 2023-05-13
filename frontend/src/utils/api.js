import axios from "axios"
import { backendUrl } from "./url"

export const getContractsOfAddress = (walletAddress) => {
  return axios.get(`${backendUrl}/getContractsOf?address=${walletAddress}`)
}

export const getSourceCodeOfContract = (contractAddress, chain) => {
  return axios.get(
    `${backendUrl}/getSourceCode?address=${contractAddress}&chain=${chain}`
  )
}

export const getAuditsOfContract = (contractAddress) => {
  return axios.get(`${backendUrl}/getAuditOf/${contractAddress}`)
}

export const getScoreOfContract = (contractAddress) => {
  return axios.post(`${backendUrl}/getScoreOf/${contractAddress}`)
}

export const getContractType = (sourceCode) => {
  return axios.get(`${backendUrl}/getContractType/${sourceCode}`)
}

export const uploadToIpfs = (json) => {
  return axios.post(`${backendUrl}/uploadToIpfs`, {
    data: json,
  })
}

export const getBackendSignature = (
  chainId,
  contractAddress,
  ipfsHash,
  grade,
  contractType
) => {
  const urlParam = new URLSearchParams({
    chainId,
    contractAddress,
    ipfsHash,
    grade,
    contractType,
  })

  return axios.get(`${backendUrl}/getSignature${urlParam}`)
}
