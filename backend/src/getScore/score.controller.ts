import { Controller, UseFilters, Body, Post } from '@nestjs/common';
import { ScoreService } from './score.service';
import {
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { HttpExceptionFilter } from '../filters/http-exception.filter';

@ApiTags('score')
@Controller('getScore')
@UseFilters(HttpExceptionFilter)
export class ScoreController {
  constructor(private scoreService: ScoreService) {}
  @Post('')
  @ApiOkResponse({
    description: 'Retrieved score successfully.',
  })
  @ApiInternalServerErrorResponse({
    description: 'There was an error while retrieving the score.',
  })
  public async getScore(@Body() params) {
    return await this.scoreService.getScore(params);
  }
}
