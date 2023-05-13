import { Controller, Get, Query, UseFilters } from '@nestjs/common';
import { SourceCodeService } from './sourceCode.service';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { HttpExceptionFilter } from '../filters/http-exception.filter';

@Controller('getSourceCode')
@ApiTags('sourceCode')
@UseFilters(HttpExceptionFilter)
export class SourceCodeController {
  constructor(private sourceCodeService: SourceCodeService) {}
  @ApiOkResponse({
    description: 'Verified Contract source code retrieved successfully.',
  })
  @Get('')
  public contractByAddress(@Query() params) {
    return this.sourceCodeService.contractByAddress(params);
  }
}
