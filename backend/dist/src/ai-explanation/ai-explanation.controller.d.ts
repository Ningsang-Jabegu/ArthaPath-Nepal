import { AiExplanationService } from './ai-explanation.service';
import { AiExplanationRequestDto, AiExplanationResponseDto } from './ai-explanation.dto';
export declare class AiExplanationController {
    private readonly aiExplanationService;
    constructor(aiExplanationService: AiExplanationService);
    generateExplanation(request: AiExplanationRequestDto): Promise<AiExplanationResponseDto>;
}
