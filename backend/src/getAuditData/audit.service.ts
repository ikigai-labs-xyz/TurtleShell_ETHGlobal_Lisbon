import { HttpService } from '@nestjs/axios';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import config from '../config';

import { MLData } from 'src/types';
import { sleep } from 'src/utils';

interface AuditData {
  sources: string[] | undefined;
}

@Injectable()
export class AuditService {
  constructor(private auditApiService: HttpService) {}
  public async getAuditData(params: AuditData) {
    if (!params.sources) {
      throw new BadRequestException('Missing params');
    }

    const returnData: MLData[] = [];

    for (const source of params.sources) {
      try {
        const apiResult = await this.auditApiService
          .post(config.ML_AUDIT_URL, {
            target_contract: source,
          })
          .toPromise();

        const data: MLData[] = apiResult.data;

        for (const d of data) {
          returnData.push(d);
        }
      } catch (e) {
        console.log(e);
      }

      await sleep(300);
    }

    return returnData;
  }
}
