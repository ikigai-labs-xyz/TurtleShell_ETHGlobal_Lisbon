import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ContractsController } from './contracts.controller';
import { ContractsService } from './contracts.service';

@Module({
  controllers: [ContractsController],
  providers: [ContractsService],
  imports: [HttpModule],
})
export class ContractsModule {}
