import {
  AllocationEngineService,
  AllocationResult,
} from './allocation-engine.service';

describe('AllocationEngineService', () => {
  let service: AllocationEngineService;

  beforeEach(() => {
    service = new AllocationEngineService();
  });

  it('returns base conservative allocation for mid-term duration', () => {
    const result = service.generateAllocation('Conservative', 10, 100000);

    expect(result).toEqual({
      'Mutual Fund': 25,
      Stocks: 10,
      'Fixed Deposit': 40,
      Bonds: 15,
      Gold: 10,
      'Real Estate': 0,
      Business: 0,
    });
  });

  it('applies long-term adjustment for balanced profile', () => {
    const result = service.generateAllocation('Balanced', 15, 100000);

    expect(result).toEqual({
      'Mutual Fund': 35,
      Stocks: 35,
      'Fixed Deposit': 10,
      Bonds: 10,
      Gold: 10,
      'Real Estate': 0,
      Business: 0,
    });
  });

  it('applies short-term adjustment for aggressive profile', () => {
    const result = service.generateAllocation('Aggressive', 3, 100000);

    expect(result).toEqual({
      'Mutual Fund': 25,
      Stocks: 35,
      'Fixed Deposit': 30,
      Bonds: 5,
      Gold: 5,
      'Real Estate': 0,
      Business: 0,
    });
  });

  it('keeps real estate at 0 and sums to 100 for small capital', () => {
    const result = service.generateAllocation('Balanced', 10, 30000);

    expect(result['Real Estate']).toBe(0);
    const total = Object.values(result).reduce((sum, val) => sum + val, 0);
    expect(total).toBe(100);
  });

  it('always returns allocation totaling 100 for varied scenarios', () => {
    const scenarios: Array<['Conservative' | 'Balanced' | 'Aggressive', number, number]> = [
      ['Conservative', 2, 40000],
      ['Conservative', 20, 120000],
      ['Balanced', 4, 200000],
      ['Balanced', 15, 35000],
      ['Aggressive', 3, 45000],
      ['Aggressive', 25, 500000],
    ];

    scenarios.forEach(([riskProfile, durationYears, initialCapital]) => {
      const result = service.generateAllocation(
        riskProfile,
        durationYears,
        initialCapital,
      );
      const total = Object.values(result).reduce((sum, val) => sum + val, 0);
      expect(total).toBe(100);
    });
  });

  it('calculates capital distribution from percentages', () => {
    const allocation: AllocationResult = {
      'Mutual Fund': 25,
      Stocks: 35,
      'Fixed Deposit': 30,
      Bonds: 5,
      Gold: 5,
      'Real Estate': 0,
      Business: 0,
    };

    const distribution = service.calculateCapitalDistribution(allocation, 100000);

    expect(distribution).toEqual({
      'Mutual Fund': 25000,
      Stocks: 35000,
      'Fixed Deposit': 30000,
      Bonds: 5000,
      Gold: 5000,
      'Real Estate': 0,
      Business: 0,
    });
  });
});