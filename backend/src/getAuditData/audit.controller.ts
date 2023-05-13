import { Controller, Post, UseFilters, Body } from '@nestjs/common';
import { AuditService } from './audit.service';
import {
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { HttpExceptionFilter } from '../filters/http-exception.filter';

import { MLData } from 'src/types';

@ApiTags('audit')
@Controller('getAuditData')
@UseFilters(HttpExceptionFilter)
export class AuditController {
  constructor(private auditService: AuditService) {}
  @Post('')
  @ApiOkResponse({
    description: 'Retrieved audit data from ML successfully.',
  })
  @ApiInternalServerErrorResponse({
    description:
      'There was an error while retrieving the audit data from the ML.',
  })
  public async getAuditData(@Body() params): Promise<MLData[]> {
    return await this.auditService.getAuditData(params);
  }
}
