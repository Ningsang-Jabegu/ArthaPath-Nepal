import { Controller, Post, Body, ValidationPipe, HttpCode } from '@nestjs/common';
import { AiExplanationService } from './ai-explanation.service';
import { AiExplanationRequestDto, AiExplanationResponseDto } from './ai-explanation.dto';

@Controller('ai-explanation')
export class AiExplanationController {
  constructor(private readonly aiExplanationService: AiExplanationService) {}

  /**
   * Generate AI explanation based on financial data
   * 
   * POST /ai-explanation/generate
   */
  @Post('generate')
  @HttpCode(200)
  async generateExplanation(
    @Body(ValidationPipe) request: AiExplanationRequestDto,
  ): Promise<AiExplanationResponseDto> {
    return this.aiExplanationService.generateExplanation(request);
  }
}
