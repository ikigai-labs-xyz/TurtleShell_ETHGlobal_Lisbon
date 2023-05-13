import { Controller, Get, UseFilters, Query } from '@nestjs/common';
import { SignatureService } from './signature.service';
import {
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { HttpExceptionFilter } from '../filters/http-exception.filter';

@ApiTags('signature')
@Controller('getSignature')
@UseFilters(HttpExceptionFilter)
export class SignatureController {
  constructor(private signatureService: SignatureService) {}
  @Get('')
  @ApiOkResponse({
    description: 'Created Signature successfully.',
  })
  @ApiInternalServerErrorResponse({
    description: 'There was an error while creating the Signature.',
  })
  public async composeSignature(@Query() params) {
    return await this.signatureService.composeSignature(params);
  }
}
