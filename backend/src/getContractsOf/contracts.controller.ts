import { Controller, UseFilters, Query, Get } from '@nestjs/common';
import { ContractsService } from './contracts.service';
import {
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { HttpExceptionFilter } from '../filters/http-exception.filter';

@ApiTags('score')
@Controller('getContractsOf')
@UseFilters(HttpExceptionFilter)
export class ContractsController {
  constructor(private contractsService: ContractsService) {}
  @Get('')
  @ApiOkResponse({
    description: 'Retrieved contracts successfully.',
  })
  @ApiInternalServerErrorResponse({
    description: 'There was an error while retrieving the contracts.',
  })
  public async getContractsOf(@Query() params) {
    return await this.contractsService.getContractsOf(params);
  }
}
