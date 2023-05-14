import { HttpService } from '@nestjs/axios';
import { BadRequestException, Injectable } from '@nestjs/common';
import { map } from 'rxjs/operators';
import config from 'src/config';

enum Chain {
  MUMBAI = '80001',
  OPT_GOERLI = '420',
  LINEA = '59140',
  ZKEVM = '1442',
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
      case Chain.OPT_GOERLI:
        return this.getOptimismScanSourceCode(params);
      case Chain.LINEA:
        return this.getLineaScanSourceCode(params);
      case Chain.ZKEVM:
        return this.getZkEvmSourceCode(params);
      default:
        throw new BadRequestException('Invalid chain type');
    }
  }

  private getPolygonScanSourceCode(params: Params) {
    return this.sourceCodeService
      .get(
        `https://api-testnet.polygonscan.com/api?module=contract&action=getsourcecode&address=${params.address}&apikey=${config.POLYGONSCAN_API_KEY}}`,
      )
      .pipe(
        map((response) => {
          const raw = response.data.result[0].SourceCode;

          let processed = raw;
          if (processed.startsWith('{{') && processed.endsWith('}}')) {
            processed = raw.substring(1, raw.length - 1);
          }

          const sources: string[] = [];
          let sourcesObj: SourceCodeObj;
          try {
            sourcesObj = JSON.parse(processed);
          } catch (e) {
            return {
              sources: [processed],
            };
          }

          for (const [, value] of Object.entries(sourcesObj.sources)) {
            sources.push(value.content);
          }

          return {
            sources,
          };
        }),
      );
  }

  private getOptimismScanSourceCode(params: Params) {
    return this.sourceCodeService
      .get(
        `https://api-goerli-optimism.etherscan.io/api?module=contract&action=getsourcecode&address=${params.address}&apikey=${config.GOERLI_OPTIMISM_ETHERSCAN_API_KEY}}`,
      )
      .pipe(
        map((response) => {
          const raw = response.data.result[0].SourceCode;

          let processed = raw;
          if (processed.startsWith('{{') && processed.endsWith('}}')) {
            processed = raw.substring(1, raw.length - 1);
          }

          const sources: string[] = [];
          let sourcesObj: SourceCodeObj;
          try {
            sourcesObj = JSON.parse(processed);
          } catch (e) {
            return {
              sources: [processed],
            };
          }

          for (const [, value] of Object.entries(sourcesObj.sources)) {
            sources.push(value.content);
          }

          return {
            sources,
          };
        }),
      );
  }

  private getLineaScanSourceCode(params: Params) {
    return this.sourceCodeService
      .get(
        `https://explorer.goerli.linea.build/api?module=contract&action=getsourcecode&address=${params.address}&apikey=${config.LINEA_API_KEY}}`,
      )
      .pipe(
        map((response) => {
          const raw = response.data.result[0].SourceCode;

          let processed = raw;
          if (processed.startsWith('{{') && processed.endsWith('}}')) {
            processed = raw.substring(1, raw.length - 1);
          }

          const sources: string[] = [];
          let sourcesObj: SourceCodeObj;
          try {
            sourcesObj = JSON.parse(processed);
          } catch (e) {
            return {
              sources: [processed],
            };
          }

          for (const [, value] of Object.entries(sourcesObj.sources)) {
            sources.push(value.content);
          }

          return {
            sources,
          };
        }),
      );
  }

  private getZkEvmSourceCode(params: Params) {
    return this.sourceCodeService
      .get(
        `https://api-testnet-zkevm.polygonscan.com/api?module=contract&action=getsourcecode&address=${params.address}&apikey=${config.POLYGONSCAN_API_KEY}}`,
      )
      .pipe(
        map((response) => {
          const raw = response.data.result[0].SourceCode;

          let processed = raw;
          if (processed.startsWith('{{') && processed.endsWith('}}')) {
            processed = raw.substring(1, raw.length - 1);
          }

          const sources: string[] = [];
          let sourcesObj: SourceCodeObj;
          try {
            sourcesObj = JSON.parse(processed);
          } catch (e) {
            return {
              sources: [processed],
            };
          }

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
