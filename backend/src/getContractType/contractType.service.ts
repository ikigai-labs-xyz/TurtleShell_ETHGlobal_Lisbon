import { HttpService } from '@nestjs/axios';
import { BadRequestException, Injectable } from '@nestjs/common';
import config from 'src/config';

interface SourceCode {
  rawCode: string;
  typeName: string; // convert to hash
}

interface Params {
  sourceCode: string[] | undefined;
}

const sourceCodes: SourceCode[] = [{ rawCode: 'sourceCodeHere', typeName: '' }];

@Injectable()
export class ContractTypeService {
  constructor(private contractTypeService: HttpService) {}
  public getContractType(params: Params): string {
    if (!params.sourceCode) {
      throw new BadRequestException('Missing params');
    }

    for (const sourceCode of sourceCodes) {
      if (params.sourceCode.includes(sourceCode.rawCode)) {
        return sourceCode.typeName;
      }
    }

    return 'unknown';
  }
}
