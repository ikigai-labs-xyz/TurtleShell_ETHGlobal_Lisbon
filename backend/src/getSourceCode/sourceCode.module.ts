import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { SourceCodeController } from './sourceCode.controller';
import { SourceCodeService } from './sourceCode.service';

@Module({
  controllers: [SourceCodeController],
  providers: [SourceCodeService],
  imports: [HttpModule],
})
export class SourceCodeModule {}
