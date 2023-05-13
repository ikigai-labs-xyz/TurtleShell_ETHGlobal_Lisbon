import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ContractTypeController } from './contractType.controller';
import { ContractTypeService } from './contractType.service';

@Module({
  controllers: [ContractTypeController],
  providers: [ContractTypeService],
  imports: [HttpModule],
})
export class SourceCodeModule {}
