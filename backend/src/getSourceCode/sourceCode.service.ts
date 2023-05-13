import { HttpService } from '@nestjs/axios';
import { BadRequestException, Injectable } from '@nestjs/common';
import { map } from 'rxjs/operators';
import config from 'src/config';

enum Chain {
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
      case Chain.MUMBAI:
        return this.getPolygonScanSourceCode(params);
      default:
        throw new BadRequestException('Invalid chain type');
    }
  }

  private getPolygonScanSourceCode(params: Params) {
    return this.sourceCodeService
      .get(
        `https://api-testnet.polygonscan.com/api?module=contract&action=getsourcecode&address=${params.address}&apikey=${config.ETHERSCAN_API_KEY}}`,
      )
      .pipe(
        map((response) => {
          const raw = response.data.result[0].SourceCode;
          if (typeof raw === 'string') {
            return { sources: raw };
          }

          let processed = raw;
          if (processed.startsWith('{{') && processed.endsWith('}}')) {
            processed = raw.substring(1, raw.length - 1);
          }

          const sources: string[] = [];
          const sourcesObj: SourceCodeObj = JSON.parse(processed);

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
