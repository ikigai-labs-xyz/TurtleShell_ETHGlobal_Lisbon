import { HttpService } from '@nestjs/axios';
import { BadRequestException, Injectable } from '@nestjs/common';
import { map } from 'rxjs/operators';
import config from 'src/config';

enum Chain {
  GOERLI = '5',
  MUMBAI = '80001',
}

interface Params {
  address: string | undefined;
  chain: Chain | undefined;
}

interface SourceCodeObj {
  sources: {
    [key: string]: {
      content: string;
    };
  };
}

@Injectable()
export class SourceCodeService {
  constructor(private sourceCodeService: HttpService) {}
  public contractByAddress(params: Params) {
    if (!params.address || !params.chain) {
      throw new BadRequestException('Missing params');
    }

    switch (params.chain) {
      case Chain.GOERLI:
        return this.getEtherscanSourceCode(params);
      default:
        throw new BadRequestException('Invalid chain type');
    }
  }

  private getEtherscanSourceCode(params: Params) {
    return this.sourceCodeService
      .get(
        `https://api-goerli.etherscan.io/api?module=contract&action=getsourcecode&address=${params.address}&apikey=${config.ETHERSCAN_API_KEY}}`,
      )
      .pipe(
        map((response) => {
          const raw = response.data.result[0].SourceCode;
          const trimmed = raw.substring(1, raw.length - 1);

          const sources: string[] = [];
          const sourcesObj: SourceCodeObj = JSON.parse(trimmed);

          for (const [, value] of Object.entries(sourcesObj.sources)) {
            sources.push(value.content);
          }

          return {
            sources,
          };
        }),
      );
  }
}
