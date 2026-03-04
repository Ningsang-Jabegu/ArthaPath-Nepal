import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { AiExplanationService } from './ai-explanation.service';
import { PromptTemplates } from './prompts';

describe('AiExplanationService', () => {
  let service: AiExplanationService;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AiExplanationService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              if (key === 'GEMINI_API_KEY') return undefined;
              return null;
            }),
          },
        },
      ],
    }).compile();

    service = module.get<AiExplanationService>(AiExplanationService);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('PromptTemplates', () => {
    const mockData = {
      riskProfile: 'Balanced',
      allocation: { Stocks: 0.4, Bonds: 0.3, Gold: 0.15, FD: 0.15 },
      capitalDistribution: { Stocks: 400000, Bonds: 300000, Gold: 150000, FD: 150000 },
      projections: {
        conservative: 1500000,
        expected: 2000000,
        optimistic: 2500000,
        totalContributions: 1000000,
      },
      timeHorizon: 10,
      monthlyContribution: 5000,
      riskTolerance: 'MEDIUM' as const,
      liquidityNeed: 'LOW' as const,
    };

    it('should generate allocation explanation prompt', () => {
      const prompt = PromptTemplates.getAllocationExplanation(mockData);
      expect(prompt).toContain('Stocks');
      expect(prompt).toContain('Balanced');
      expect(prompt).toContain('investment allocation');
    });

    it('should generate risk profile explanation prompt', () => {
      const prompt = PromptTemplates.getRiskProfileExplanation(mockData);
      expect(prompt).toContain('Balanced');
      expect(prompt).toContain('10 years');
      expect(prompt).toContain('risk profile');
    });

    it('should generate time horizon explanation prompt', () => {
      const prompt = PromptTemplates.getTimeHorizonExplanation(mockData);
      expect(prompt).toContain('10-year');
      expect(prompt).toContain('5,000'); // Formatted currency
      expect(prompt).toContain('compound');
    });

    it('should generate financial education narrative', () => {
      const prompt = PromptTemplates.getFinancialEducationNarrative(mockData);
      expect(prompt).toContain('investment journey');
      expect(prompt).toContain('diversification');
      expect(prompt).toContain('compound growth');
    });
  });

  describe('Price Prediction Detection', () => {
    it('should detect "will rise" pattern', () => {
      const text = 'The stock will rise in the coming months';
      expect(PromptTemplates.hasPricePredictions(text)).toBe(true);
    });

    it('should detect "will fall" pattern', () => {
      const text = 'The index will fall due to market changes';
      expect(PromptTemplates.hasPricePredictions(text)).toBe(true);
    });

    it('should detect "guaranteed returns"', () => {
      const text = 'You will get guaranteed returns of 20%';
      expect(PromptTemplates.hasPricePredictions(text)).toBe(true);
    });

    it('should detect specific price predictions', () => {
      const text = 'The stock will reach $500 per share';
      expect(PromptTemplates.hasPricePredictions(text)).toBe(true);
    });

    it('should not flag educational content', () => {
      const text = 'Diversification helps reduce portfolio risk by spreading investments across different asset classes.';
      expect(PromptTemplates.hasPricePredictions(text)).toBe(false);
    });

    it('should not flag historical context', () => {
      const text = 'Historically, stocks have provided positive returns over long periods.';
      expect(PromptTemplates.hasPricePredictions(text)).toBe(false);
    });
  });

  describe('Disclaimer', () => {
    it('should contain critical disclaimer text', () => {
      const disclaimer = PromptTemplates.DISCLAIMER;
      expect(disclaimer).toContain('DISCLAIMER');
      expect(disclaimer).toContain('educational purposes');
      expect(disclaimer).toContain('financial advice');
      expect(disclaimer).toContain('Past performance');
    });

    it('should contain risk warning', () => {
      const disclaimer = PromptTemplates.DISCLAIMER;
      expect(disclaimer).toContain('risk');
      expect(disclaimer).toContain('loss of principal');
    });

    it('should contain regulatory notice', () => {
      const disclaimer = PromptTemplates.DISCLAIMER;
      expect(disclaimer).toContain('licensed financial advisor');
    });
  });

  describe('Cache Management', () => {
    it('should cache responses', () => {
      const key = 'test_key';
      const response = 'Test response';
      
      // Access private method through service instance for testing
      expect(() => {
        service['saveToCache'](key, response);
        const cached = service['getFromCache'](key);
        expect(cached).toBe(response);
      }).not.toThrow();
    });

    it('should expire cache entries after TTL', async () => {
      const key = 'expiring_key';
      const response = 'Expiring response';
      
      service['saveToCache'](key, response);
      const cached1 = service['getFromCache'](key);
      expect(cached1).toBe(response);

      // Manually set expiration to past
      const entry = service['responseCache'].get(key);
      if (entry) {
        entry.expiresAt = Date.now() - 1000;
      }

      const cached2 = service['getFromCache'](key);
      expect(cached2).toBeNull();
    });

    it('should clear entire cache', () => {
      service['saveToCache']('key1', 'response1');
      service['saveToCache']('key2', 'response2');
      
      service.clearCache();
      
      expect(service['getFromCache']('key1')).toBeNull();
      expect(service['getFromCache']('key2')).toBeNull();
    });

    it('should limit cache size', () => {
      // Add more entries than the limit (100)
      for (let i = 0; i < 150; i++) {
        service['saveToCache'](`key_${i}`, `response_${i}`);
      }

      // Cache should have pruned old entries
      expect(service['responseCache'].size).toBeLessThan(150);
      expect(service['responseCache'].size).toBeGreaterThan(80); // At least most recent entries
    });
  });

  describe('API Key Configuration', () => {
    it('should handle missing API key gracefully', () => {
      // Service already initialized without API key
      expect(service).toBeDefined();
      // Attempting to use it would throw appropriate error
    });
  });

  describe('Cache Key Generation', () => {
    it('should generate consistent cache keys', () => {
      const request1 = {
        risk_profile: 'Balanced',
        allocation: { Stocks: 0.4, Bonds: 0.6 },
        capital_distribution: {},
        projection: {
          conservative: 1000000,
          expected: 1200000,
          optimistic: 1400000,
          total_contributions: 500000,
        },
        time_horizon: 10,
        risk_tolerance: 'MEDIUM',
        liquidity_need: 'LOW',
        explanation_type: 'narrative',
      };

      const key1 = service['generateCacheKey'](request1);
      const key2 = service['generateCacheKey'](request1);

      expect(key1).toBe(key2);
    });

    it('should generate different keys for different data', () => {
      const request1 = {
        risk_profile: 'Balanced',
        allocation: { Stocks: 0.4, Bonds: 0.6 },
        capital_distribution: {},
        projection: {
          conservative: 1000000,
          expected: 1200000,
          optimistic: 1400000,
          total_contributions: 500000,
        },
        time_horizon: 10,
        risk_tolerance: 'MEDIUM',
        liquidity_need: 'LOW',
        explanation_type: 'narrative',
      };

      const request2 = {
        ...request1,
        risk_profile: 'Aggressive',
      };

      const key1 = service['generateCacheKey'](request1);
      const key2 = service['generateCacheKey'](request2);

      expect(key1).not.toBe(key2);
    });
  });
});
