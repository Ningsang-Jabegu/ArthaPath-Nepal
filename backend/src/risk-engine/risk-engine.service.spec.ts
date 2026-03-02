import { RiskEngineService } from './risk-engine.service';

describe('RiskEngineService', () => {
  let service: RiskEngineService;

  beforeEach(() => {
    service = new RiskEngineService();
  });

  describe('calculateRiskProfile', () => {
    it('returns Conservative for clearly low risk score', () => {
      const result = service.calculateRiskProfile(2, 'High', 'Low', false);
      expect(result).toBe('Conservative');
    });

    it('returns Conservative at boundary score 35', () => {
      const result = service.calculateRiskProfile(5, 'High', 'Medium', false);
      expect(result).toBe('Conservative');
    });

    it('returns Balanced for mid-range score', () => {
      const result = service.calculateRiskProfile(10, 'Medium', 'Medium', false);
      expect(result).toBe('Balanced');
    });

    it('returns Balanced at boundary score 65', () => {
      const result = service.calculateRiskProfile(5, 'Low', 'Medium', true);
      expect(result).toBe('Balanced');
    });

    it('returns Aggressive for score above 65', () => {
      const result = service.calculateRiskProfile(15, 'Low', 'Low', true);
      expect(result).toBe('Aggressive');
    });

    it('returns Aggressive for maximum possible score', () => {
      const result = service.calculateRiskProfile(20, 'Low', 'High', true);
      expect(result).toBe('Aggressive');
    });
  });
});