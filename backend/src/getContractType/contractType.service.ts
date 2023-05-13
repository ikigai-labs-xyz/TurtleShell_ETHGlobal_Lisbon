import { HttpService } from '@nestjs/axios';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ethers } from 'ethers';
import config from 'src/config';

interface SourceCode {
  rawCode: string;
  typeName: string; // convert to hash
}

interface Params {
  sources: string[] | undefined;
}

const sourceCodes: SourceCode[] = [{ rawCode: '', typeName: 'flash-loan' }];

@Injectable()
export class ContractTypeService {
  constructor(private contractTypeService: HttpService) {}
  public getContractType(params: Params): string {
    if (!params.sources) {
      throw new BadRequestException('Missing params');
    }

    for (const sourceCode of sourceCodes) {
      for (const source of params.sources) {
        if (source.includes(sourceCode.rawCode)) {
          return ethers.utils.keccak256(
            ethers.utils.toUtf8Bytes(sourceCode.typeName),
          );
        }
      }
    }

    return ethers.utils.keccak256(ethers.utils.toUtf8Bytes('unknown'));
  }
}
