import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';

import config from 'src/config';
import { sleep } from 'src/utils';

interface ContractsParams {
  address: string;
}

const endpoints: string[] = [
  `https://api-testnet.polygonscan.com/api?module=account&action=txlist&address={address}&startblock=0&endblock=99999999&page=1&offset=10&sort=asc&apikey={apiKey}`,
  `https://api-goerli-optimism.etherscan.io/api?module=account&action=txlist&address={address}&startblock=0&endblock=99999999&page=1&offset=10&sort=asc&apikey={apiKey}`,
];

@Injectable()
export class ContractsService {
  constructor(private contractsApiService: HttpService) {}
  public async getContractsOf(params: ContractsParams) {
    const contracts: { address: string; chain: number }[] = [];

    // loop through endpoints
    for (const endpoint of endpoints) {
      let url = endpoint;
      url = url.replace('{address}', params.address);
      let chain: number;

      switch (true) {
        case url.includes('goerli-optimism'):
          url = url.replace(
            '{apiKey}',
            config.GOERLI_OPTIMISM_ETHERSCAN_API_KEY,
          );
          chain = 420;
          break;
        case url.includes('polygonscan'):
          url = url.replace('{apiKey}', config.POLYGONSCAN_API_KEY);
          chain = 80001;
        default:
          break;
      }

      const apiResult = await this.contractsApiService.get(url).toPromise();
      const data = apiResult.data.result;
      for (const transaction of data) {
        if (transaction.to === '') {
          contracts.push({
            address: transaction.contractAddress,
            chain,
          });
        }
      }

      await sleep(100);
    }

    return contracts;
  }
}
