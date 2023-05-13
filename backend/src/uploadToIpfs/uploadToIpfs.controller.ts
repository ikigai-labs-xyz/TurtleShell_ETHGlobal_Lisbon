import { Controller, Post, UseFilters, Body } from '@nestjs/common';
import { IpfsService } from './uploadToIpfs.service';
import { ApiTags } from '@nestjs/swagger';
import { HttpExceptionFilter } from '../filters/http-exception.filter';

@Controller('uploadToIpfs')
@ApiTags('uploadToIpfs')
@UseFilters(HttpExceptionFilter)
export class UploadToIpfsController {
  constructor(private pinataService: IpfsService) {}
  @Post()
  public uploadSvgToIpfs(@Body() body: any) {
    return this.pinataService.uploadToIpfs(body);
  }
}
