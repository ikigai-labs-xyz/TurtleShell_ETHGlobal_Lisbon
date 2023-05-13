import { Controller, Get, Query, UseFilters } from '@nestjs/common';
import { ContractTypeService } from './contractType.service';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { HttpExceptionFilter } from '../filters/http-exception.filter';

@Controller('getSourceCode')
@ApiTags('sourceCode')
@UseFilters(HttpExceptionFilter)
export class ContractTypeController {
  constructor(private contractTypeService: ContractTypeService) {}
  @ApiOkResponse({
    description: 'Contract type retrieved successfully.',
  })
  @Get('')
  public contractByAddress(@Query() params) {
    return this.contractTypeService.getContractType(params);
  }
}
