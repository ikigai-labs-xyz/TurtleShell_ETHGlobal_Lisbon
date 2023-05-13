import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ScoreController } from './score.controller';
import { ScoreService } from './score.service';

@Module({
  controllers: [ScoreController],
  providers: [ScoreService],
  imports: [HttpModule],
})
export class ScoreModule {}
