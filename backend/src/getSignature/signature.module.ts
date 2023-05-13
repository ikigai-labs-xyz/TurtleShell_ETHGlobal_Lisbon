import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { SignatureController } from './signature.controller';
import { SignatureService } from './signature.service';

@Module({
  controllers: [SignatureController],
  providers: [SignatureService],
  imports: [HttpModule],
})
export class SignatureModule {}
