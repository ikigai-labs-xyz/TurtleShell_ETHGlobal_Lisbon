import axios from "axios"
import { backendUrl } from "./url"

export const getContractsOfAddress = (walletAddress) => {
  return axios.get(`${backendUrl}/getContractsOf?address=${walletAddress}`)
}

export const getAuditsOfContract = (contractAddress) => {
  return axios.get(`${backendUrl}/getAuditOf/${contractAddress}`)
}

export const getScoreOfContract = (contractAddress) => {
  return axios.get(`${backendUrl}/getScoreOf/${contractAddress}`)
}

export const uploadToIpfs = (json) => {
  return axios.post(`${backendUrl}/uploadToIpfs`, {
    data: json,
  })
}

export const getBackendSignature = (ipfsCid) => {
  return axios.post(`${backendUrl}/getBackendSignature`, {
    ipfsHash: ipfsCid,
  })
}
