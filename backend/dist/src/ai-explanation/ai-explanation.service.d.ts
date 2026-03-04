import { ConfigService } from '@nestjs/config';
import { AiExplanationRequestDto, AiExplanationResponseDto } from './ai-explanation.dto';
export declare class AiExplanationService {
    private configService;
    private genAI;
    private responseCache;
    private readonly CACHE_TTL;
    private readonly MODEL_NAME;
    constructor(configService: ConfigService);
    generateExplanation(request: AiExplanationRequestDto): Promise<AiExplanationResponseDto>;
    private selectPrompt;
    private callGeminiAPI;
    private generateCacheKey;
    private getFromCache;
    private saveToCache;
    clearCache(): void;
}
