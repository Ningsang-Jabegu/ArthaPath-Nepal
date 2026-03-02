import { ProjectionEngineService } from './projection-engine.service';

describe('ProjectionEngineService', () => {
  let service: ProjectionEngineService;

  beforeEach(() => {
    service = new ProjectionEngineService();
  });

  describe('calculateProjection', () => {
    it('returns correctly calculated total contributions', () => {
      const result = service.calculateProjection(100000, 5000, 10, 'Balanced');

      expect(result.total_contributions).toBe(700000);
    });

    it('maintains scenario ordering: optimistic > expected > conservative', () => {
      const result = service.calculateProjection(100000, 5000, 10, 'Balanced');

      expect(result.optimistic).toBeGreaterThan(result.expected);
      expect(result.expected).toBeGreaterThan(result.conservative);
    });

    it('calculates zero gain when duration is zero', () => {
      const result = service.calculateProjection(100000, 5000, 0, 'Conservative');

      expect(result.total_contributions).toBe(100000);
      expect(result.conservative).toBe(100000);
      expect(result.expected).toBe(100000);
      expect(result.optimistic).toBe(100000);
      expect(result.estimated_gain_conservative).toBe(0);
      expect(result.estimated_gain_expected).toBe(0);
      expect(result.estimated_gain_optimistic).toBe(0);
    });

    it('works with no monthly contribution and still grows principal', () => {
      const result = service.calculateProjection(200000, 0, 5, 'Conservative');

      expect(result.total_contributions).toBe(200000);
      expect(result.conservative).toBeGreaterThan(200000);
      expect(result.expected).toBeGreaterThan(result.conservative);
      expect(result.optimistic).toBeGreaterThan(result.expected);
    });

    it('returns gains matching scenario value minus total contributions', () => {
      const result = service.calculateProjection(150000, 3000, 7, 'Aggressive');

      expect(result.estimated_gain_conservative).toBe(
        result.conservative - result.total_contributions,
      );
      expect(result.estimated_gain_expected).toBe(
        result.expected - result.total_contributions,
      );
      expect(result.estimated_gain_optimistic).toBe(
        result.optimistic - result.total_contributions,
      );
    });
  });

  describe('generateYearlyProjection', () => {
    it('returns durationYears + 1 records including year 0', () => {
      const result = service.generateYearlyProjection(100000, 5000, 10, 'Balanced');

      expect(result).toHaveLength(11);
      expect(result[0].year).toBe(0);
      expect(result[10].year).toBe(10);
    });

    it('starts year 0 with initial capital for all scenarios', () => {
      const result = service.generateYearlyProjection(120000, 0, 5, 'Aggressive');

      expect(result[0].conservative).toBe(120000);
      expect(result[0].expected).toBe(120000);
      expect(result[0].optimistic).toBe(120000);
    });

    it('produces non-decreasing values over time for each scenario', () => {
      const result = service.generateYearlyProjection(100000, 2000, 8, 'Conservative');

      for (let i = 1; i < result.length; i++) {
        expect(result[i].conservative).toBeGreaterThanOrEqual(
          result[i - 1].conservative,
        );
        expect(result[i].expected).toBeGreaterThanOrEqual(result[i - 1].expected);
        expect(result[i].optimistic).toBeGreaterThanOrEqual(
          result[i - 1].optimistic,
        );
      }
    });
  });
});