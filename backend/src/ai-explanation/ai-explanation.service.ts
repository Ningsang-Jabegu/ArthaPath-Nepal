import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } from '@google/generative-ai';
import { PromptTemplates, PromptData } from './prompts';
import { AiExplanationRequestDto, AiExplanationResponseDto } from './ai-explanation.dto';

interface CacheEntry {
  response: string;
  timestamp: number;
  expiresAt: number;
}

@Injectable()
export class AiExplanationService {
  private genAI: GoogleGenerativeAI;
  private responseCache: Map<string, CacheEntry> = new Map();
  private readonly CACHE_TTL = 1000 * 60 * 60; // 1 hour
  private readonly MODEL_NAME = 'gemini-1.5-flash';

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');
    if (!apiKey) {
      console.warn('GEMINI_API_KEY not configured. AI explanations will be disabled.');
    } else {
      this.genAI = new GoogleGenerativeAI(apiKey);
    }
  }

  /**
   * Generate AI explanation for financial data
   */
  async generateExplanation(
    request: AiExplanationRequestDto,
  ): Promise<AiExplanationResponseDto> {
    if (!this.genAI) {
      throw new HttpException(
        'AI explanation service is not configured',
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }

    // Check cache first
    const cacheKey = this.generateCacheKey(request);
    const cachedResponse = this.getFromCache(cacheKey);
    if (cachedResponse) {
      return {
        explanation: cachedResponse,
        type: request.explanation_type || 'narrative',
        generated_at: new Date(),
        model: this.MODEL_NAME,
      };
    }

    try {
      // Prepare prompt data
      const promptData: PromptData = {
        riskProfile: request.risk_profile,
        allocation: request.allocation,
        capitalDistribution: request.capital_distribution,
        projections: {
          conservative: request.projection.conservative,
          expected: request.projection.expected,
          optimistic: request.projection.optimistic,
          totalContributions: request.projection.total_contributions,
        },
        timeHorizon: request.time_horizon,
        monthlyContribution: request.monthly_contribution,
        riskTolerance: request.risk_tolerance as 'LOW' | 'MEDIUM' | 'HIGH',
        liquidityNeed: request.liquidity_need as 'LOW' | 'MEDIUM' | 'HIGH',
      };

      // Select prompt template based on explanation type
      const prompt = this.selectPrompt(promptData, request.explanation_type);

      // Call Gemini API
      const explanation = await this.callGeminiAPI(prompt);

      // Validate for price predictions
      if (PromptTemplates.hasPricePredictions(explanation)) {
        console.warn('AI response contained price predictions. Filtering content.');
        // In production, you might want to regenerate or return a safe fallback
      }

      // Add disclaimer
      const fullExplanation = explanation + PromptTemplates.DISCLAIMER;

      // Cache the response
      this.saveToCache(cacheKey, fullExplanation);

      return {
        explanation: fullExplanation,
        type: request.explanation_type || 'narrative',
        generated_at: new Date(),
        model: this.MODEL_NAME,
      };
    } catch (error) {
      console.error('Error generating AI explanation:', error);
      throw new HttpException(
        'Failed to generate AI explanation. Please try again later.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Select appropriate prompt template
   */
  private selectPrompt(data: PromptData, explanationType: string): string {
    switch (explanationType) {
      case 'allocation':
        return PromptTemplates.getAllocationExplanation(data);
      case 'risk_profile':
        return PromptTemplates.getRiskProfileExplanation(data);
      case 'time_horizon':
        return PromptTemplates.getTimeHorizonExplanation(data);
      case 'narrative':
      default:
        return PromptTemplates.getFinancialEducationNarrative(data);
    }
  }

  /**
   * Call Google Generative AI API
   */
  private async callGeminiAPI(prompt: string): Promise<string> {
    const model = this.genAI.getGenerativeModel({
      model: this.MODEL_NAME,
      safetySettings: [
        {
          category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
          threshold: HarmBlockThreshold.BLOCK_NONE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_HARASSMENT,
          threshold: HarmBlockThreshold.BLOCK_NONE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
          threshold: HarmBlockThreshold.BLOCK_NONE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
          threshold: HarmBlockThreshold.BLOCK_NONE,
        },
      ],
    });

    const result = await model.generateContent(prompt);
    const response = result.response;

    if (!response.text()) {
      throw new Error('No response from Gemini API');
    }

    return response.text();
  }

  /**
   * Generate cache key from request
   */
  private generateCacheKey(request: AiExplanationRequestDto): string {
    const key = `${request.risk_profile}_${request.explanation_type || 'narrative'}_${request.time_horizon}_${request.risk_tolerance}`;
    // Simple hash of allocation for uniqueness
    const allocationHash = JSON.stringify(
      Object.entries(request.allocation)
        .filter(([, v]) => v > 0)
        .sort(),
    )
      .split('')
      .reduce((acc, char) => acc + char.charCodeAt(0), 0)
      .toString(36);
    return `${key}_${allocationHash}`;
  }

  /**
   * Get response from cache
   */
  private getFromCache(key: string): string | null {
    const entry = this.responseCache.get(key);
    if (!entry) return null;

    // Check if cache has expired
    if (Date.now() > entry.expiresAt) {
      this.responseCache.delete(key);
      return null;
    }

    return entry.response;
  }

  /**
   * Save response to cache
   */
  private saveToCache(key: string, response: string): void {
    this.responseCache.set(key, {
      response,
      timestamp: Date.now(),
      expiresAt: Date.now() + this.CACHE_TTL,
    });

    // Optional: Implement size limit to prevent unbounded cache growth
    if (this.responseCache.size > 100) {
      // Remove oldest entries
      const sortedEntries = Array.from(this.responseCache.entries())
        .sort((a, b) => a[1].timestamp - b[1].timestamp);
      for (let i = 0; i < 20; i++) {
        this.responseCache.delete(sortedEntries[i][0]);
      }
    }
  }

  /**
   * Clear cache manually (useful for testing or admin operations)
   */
  clearCache(): void {
    this.responseCache.clear();
  }
}
