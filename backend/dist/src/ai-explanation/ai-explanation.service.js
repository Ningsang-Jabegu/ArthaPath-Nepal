"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiExplanationService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const generative_ai_1 = require("@google/generative-ai");
const prompts_1 = require("./prompts");
let AiExplanationService = class AiExplanationService {
    configService;
    genAI;
    responseCache = new Map();
    CACHE_TTL = 1000 * 60 * 60;
    MODEL_NAME = 'gemini-1.5-flash';
    constructor(configService) {
        this.configService = configService;
        const apiKey = this.configService.get('GEMINI_API_KEY');
        if (!apiKey) {
            console.warn('GEMINI_API_KEY not configured. AI explanations will be disabled.');
        }
        else {
            this.genAI = new generative_ai_1.GoogleGenerativeAI(apiKey);
        }
    }
    async generateExplanation(request) {
        if (!this.genAI) {
            throw new common_1.HttpException('AI explanation service is not configured', common_1.HttpStatus.SERVICE_UNAVAILABLE);
        }
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
            const promptData = {
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
                riskTolerance: request.risk_tolerance,
                liquidityNeed: request.liquidity_need,
            };
            const prompt = this.selectPrompt(promptData, request.explanation_type);
            const explanation = await this.callGeminiAPI(prompt);
            if (prompts_1.PromptTemplates.hasPricePredictions(explanation)) {
                console.warn('AI response contained price predictions. Filtering content.');
            }
            const fullExplanation = explanation + prompts_1.PromptTemplates.DISCLAIMER;
            this.saveToCache(cacheKey, fullExplanation);
            return {
                explanation: fullExplanation,
                type: request.explanation_type || 'narrative',
                generated_at: new Date(),
                model: this.MODEL_NAME,
            };
        }
        catch (error) {
            console.error('Error generating AI explanation:', error);
            throw new common_1.HttpException('Failed to generate AI explanation. Please try again later.', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    selectPrompt(data, explanationType) {
        switch (explanationType) {
            case 'allocation':
                return prompts_1.PromptTemplates.getAllocationExplanation(data);
            case 'risk_profile':
                return prompts_1.PromptTemplates.getRiskProfileExplanation(data);
            case 'time_horizon':
                return prompts_1.PromptTemplates.getTimeHorizonExplanation(data);
            case 'narrative':
            default:
                return prompts_1.PromptTemplates.getFinancialEducationNarrative(data);
        }
    }
    async callGeminiAPI(prompt) {
        const model = this.genAI.getGenerativeModel({
            model: this.MODEL_NAME,
            safetySettings: [
                {
                    category: generative_ai_1.HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
                    threshold: generative_ai_1.HarmBlockThreshold.BLOCK_NONE,
                },
                {
                    category: generative_ai_1.HarmCategory.HARM_CATEGORY_HARASSMENT,
                    threshold: generative_ai_1.HarmBlockThreshold.BLOCK_NONE,
                },
                {
                    category: generative_ai_1.HarmCategory.HARM_CATEGORY_HATE_SPEECH,
                    threshold: generative_ai_1.HarmBlockThreshold.BLOCK_NONE,
                },
                {
                    category: generative_ai_1.HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
                    threshold: generative_ai_1.HarmBlockThreshold.BLOCK_NONE,
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
    generateCacheKey(request) {
        const key = `${request.risk_profile}_${request.explanation_type || 'narrative'}_${request.time_horizon}_${request.risk_tolerance}`;
        const allocationHash = JSON.stringify(Object.entries(request.allocation)
            .filter(([, v]) => v > 0)
            .sort())
            .split('')
            .reduce((acc, char) => acc + char.charCodeAt(0), 0)
            .toString(36);
        return `${key}_${allocationHash}`;
    }
    getFromCache(key) {
        const entry = this.responseCache.get(key);
        if (!entry)
            return null;
        if (Date.now() > entry.expiresAt) {
            this.responseCache.delete(key);
            return null;
        }
        return entry.response;
    }
    saveToCache(key, response) {
        this.responseCache.set(key, {
            response,
            timestamp: Date.now(),
            expiresAt: Date.now() + this.CACHE_TTL,
        });
        if (this.responseCache.size > 100) {
            const sortedEntries = Array.from(this.responseCache.entries())
                .sort((a, b) => a[1].timestamp - b[1].timestamp);
            for (let i = 0; i < 20; i++) {
                this.responseCache.delete(sortedEntries[i][0]);
            }
        }
    }
    clearCache() {
        this.responseCache.clear();
    }
};
exports.AiExplanationService = AiExplanationService;
exports.AiExplanationService = AiExplanationService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], AiExplanationService);
//# sourceMappingURL=ai-explanation.service.js.map