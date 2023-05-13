import { Body, Controller, Post, UseFilters } from '@nestjs/common';
import { ContractTypeService } from './contractType.service';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { HttpExceptionFilter } from '../filters/http-exception.filter';

@Controller('getContractType')
@ApiTags('contractType')
@UseFilters(HttpExceptionFilter)
export class ContractTypeController {
  constructor(private contractTypeService: ContractTypeService) {}
  @ApiOkResponse({
    description: 'Contract type retrieved successfully.',
  })
  @Post('')
  public getContractType(@Body() params) {
    return this.contractTypeService.getContractType(params);
  }
}
