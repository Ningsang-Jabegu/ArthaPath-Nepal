import { Module } from '@nestjs/common';
import { AiExplanationService } from './ai-explanation.service';
import { AiExplanationController } from './ai-explanation.controller';

@Module({
  providers: [AiExplanationService],
  controllers: [AiExplanationController],
  exports: [AiExplanationService],
})
export class AiExplanationModule {}
