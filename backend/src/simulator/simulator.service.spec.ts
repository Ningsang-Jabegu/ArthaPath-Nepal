import { Test, TestingModule } from '@nestjs/testing';
import { SimulatorService } from './simulator.service';
import { RiskEngineService } from '../risk-engine/risk-engine.service';
import { AllocationEngineService } from '../allocation-engine/allocation-engine.service';
import { ProjectionEngineService } from '../projection-engine/projection-engine.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { SimulationHistory } from '../entities/simulation-history.entity';
import { UserInputDto } from './dto/user-input.dto';

describe('SimulatorService', () => {
  let service: SimulatorService;
  let mockRiskEngine: Partial<RiskEngineService>;
  let mockAllocationEngine: Partial<AllocationEngineService>;
  let mockProjectionEngine: Partial<ProjectionEngineService>;
  let mockRepository: any;

  const mockUserInput: UserInputDto = {
    initial_capital: 100000,
    monthly_contribution: 5000,
    duration_years: 5,
    risk_tolerance: 'Medium',
    liquidity_need: 'Medium',
    has_emergency_fund: true,
  };

  beforeEach(async () => {
    // Mock RiskEngineService
    mockRiskEngine = {
      calculateRiskProfile: jest.fn().mockReturnValue('Balanced'),
    };

    // Mock AllocationEngineService
    mockAllocationEngine = {
      generateAllocation: jest.fn().mockReturnValue({
        'Mutual Fund': 30,
        Stocks: 50,
        'Fixed Deposit': 10,
        Bonds: 5,
        Gold: 3,
        'Real Estate': 2,
        Business: 0,
      }),
      calculateCapitalDistribution: jest
        .fn()
        .mockImplementation((allocation, capital) => {
          // Dynamic mock: calculate distribution based on allocation percentages
          return {
            'Mutual Fund': (capital * allocation['Mutual Fund']) / 100,
            Stocks: (capital * allocation.Stocks) / 100,
            'Fixed Deposit': (capital * allocation['Fixed Deposit']) / 100,
            Bonds: (capital * allocation.Bonds) / 100,
            Gold: (capital * allocation.Gold) / 100,
            'Real Estate': (capital * allocation['Real Estate']) / 100,
            Business: (capital * allocation.Business) / 100,
          };
        }),
    };

    // Mock ProjectionEngineService
    mockProjectionEngine = {
      calculateProjection: jest.fn().mockReturnValue({
        conservative: 150000,
        expected: 180000,
        optimistic: 220000,
        total_contributions: 400000,
        estimated_gain_expected: 80000,
        estimated_gain_conservative: 50000,
        estimated_gain_optimistic: 120000,
      }),
      generateYearlyProjection: jest.fn().mockReturnValue([
        { year: 1, conservative: 110000, expected: 120000, optimistic: 130000 },
        { year: 2, conservative: 120000, expected: 140000, optimistic: 160000 },
        { year: 3, conservative: 132000, expected: 162000, optimistic: 195000 },
        { year: 4, conservative: 144000, expected: 188000, optimistic: 235000 },
        { year: 5, conservative: 158000, expected: 217000, optimistic: 282000 },
      ]),
    };

    // Mock Repository
    mockRepository = {
      save: jest.fn().mockResolvedValue({}),
      find: jest.fn().mockResolvedValue([]),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SimulatorService,
        {
          provide: RiskEngineService,
          useValue: mockRiskEngine,
        },
        {
          provide: AllocationEngineService,
          useValue: mockAllocationEngine,
        },
        {
          provide: ProjectionEngineService,
          useValue: mockProjectionEngine,
        },
        {
          provide: getRepositoryToken(SimulationHistory),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<SimulatorService>(SimulatorService);
  });

  describe('runSimulation', () => {
    it('should complete a full simulation run', async () => {
      const result = await service.runSimulation(mockUserInput);

      expect(result).toHaveProperty('risk_profile');
      expect(result).toHaveProperty('allocation');
      expect(result).toHaveProperty('capital_distribution');
      expect(result).toHaveProperty('projection');
      expect(result).toHaveProperty('yearly_projection');
    });

    it('should recalculate risk profile on input change', async () => {
      const newInput = { ...mockUserInput, risk_tolerance: 'High' as const };

      await service.runSimulation(newInput);

      expect(mockRiskEngine.calculateRiskProfile).toHaveBeenCalledWith(
        newInput.duration_years,
        newInput.liquidity_need,
        newInput.risk_tolerance,
        newInput.has_emergency_fund,
      );
    });

    it('should recalculate allocation on risk profile change', async () => {
      const newInput = { ...mockUserInput, duration_years: 10 };

      await service.runSimulation(newInput);

      expect(mockAllocationEngine.generateAllocation).toHaveBeenCalled();
    });

    it('should recalculate projection on capital input change', async () => {
      const newInput = { ...mockUserInput, initial_capital: 500000 };

      await service.runSimulation(newInput);

      expect(mockProjectionEngine.calculateProjection).toHaveBeenCalledWith(
        newInput.initial_capital,
        newInput.monthly_contribution,
        newInput.duration_years,
        'Balanced',
      );
    });

    it('should return updated results with new capital', async () => {
      const result = await service.runSimulation(mockUserInput);

      expect(result.capital_distribution).toBeDefined();
      expect(result.capital_distribution.Stocks).toBe(50000);
      expect(result.capital_distribution['Mutual Fund']).toBe(30000);
    });

    it('should generate yearly projection for charts', async () => {
      const result = await service.runSimulation(mockUserInput);

      expect(result.yearly_projection).toHaveLength(5);
      expect(result.yearly_projection[0]).toHaveProperty('year');
      expect(result.yearly_projection[0]).toHaveProperty('conservative');
      expect(result.yearly_projection[0]).toHaveProperty('expected');
      expect(result.yearly_projection[0]).toHaveProperty('optimistic');
    });

    it('should save to history if userId is provided', async () => {
      const userId = 'test-user-123';

      await service.runSimulation(mockUserInput, userId);

      expect(mockRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          user_id: userId,
          initial_capital: mockUserInput.initial_capital,
          monthly_contribution: mockUserInput.monthly_contribution,
          duration_years: mockUserInput.duration_years,
        }),
      );
    });

    it('should not save to history if userId is not provided', async () => {
      await service.runSimulation(mockUserInput);

      expect(mockRepository.save).not.toHaveBeenCalled();
    });

    it('should handle edge case: minimum capital', async () => {
      const minInput = { ...mockUserInput, initial_capital: 5000 };

      const result = await service.runSimulation(minInput);

      expect(result.risk_profile).toBeDefined();
      expect(result.allocation).toBeDefined();
    });

    it('should handle edge case: maximum duration', async () => {
      const maxInput = { ...mockUserInput, duration_years: 50 };

      const result = await service.runSimulation(maxInput);

      expect(result.yearly_projection.length).toBeGreaterThan(0);
    });

    it('should handle edge case: zero monthly contribution', async () => {
      const noMonthlyInput = { ...mockUserInput, monthly_contribution: 0 };

      const result = await service.runSimulation(noMonthlyInput);

      expect(result.projection).toBeDefined();
      expect(result.projection.expected).toBeDefined();
    });

    it('should handle different liquidity needs (low impact)', async () => {
      const lowLiquidityInput = {
        ...mockUserInput,
        liquidity_need: 'Low' as const,
      };

      const result = await service.runSimulation(lowLiquidityInput);

      expect(mockRiskEngine.calculateRiskProfile).toHaveBeenCalledWith(
        expect.anything(),
        'Low',
        expect.anything(),
        expect.anything(),
      );
      expect(result.risk_profile).toBeDefined();
    });

    it('should handle different liquidity needs (high impact)', async () => {
      const highLiquidityInput = {
        ...mockUserInput,
        liquidity_need: 'High' as const,
      };

      const result = await service.runSimulation(highLiquidityInput);

      expect(mockRiskEngine.calculateRiskProfile).toHaveBeenCalledWith(
        expect.anything(),
        'High',
        expect.anything(),
        expect.anything(),
      );
      expect(result.risk_profile).toBeDefined();
    });

    it('should recalculate when emergency fund status changes', async () => {
      const noEmergencyFund = { ...mockUserInput, has_emergency_fund: false };

      const result = await service.runSimulation(noEmergencyFund);

      expect(mockRiskEngine.calculateRiskProfile).toHaveBeenCalledWith(
        expect.anything(),
        expect.anything(),
        expect.anything(),
        false,
      );
      expect(result.risk_profile).toBeDefined();
    });

    it('should handle rapid successive input changes', async () => {
      // Simulate rapid input changes (like slider adjustments)
      const inputs = [
        { ...mockUserInput, initial_capital: 100000 },
        { ...mockUserInput, initial_capital: 150000 },
        { ...mockUserInput, initial_capital: 200000 },
        { ...mockUserInput, initial_capital: 250000 },
      ];

      for (const input of inputs) {
        const result = await service.runSimulation(input);
        expect(result).toBeDefined();
      }

      // Should have called allocation engine 4 times
      expect(mockAllocationEngine.generateAllocation).toHaveBeenCalledTimes(4);
    });

    it('should maintain data integrity across recalculations', async () => {
      const result1 = await service.runSimulation(mockUserInput);
      const result2 = await service.runSimulation(mockUserInput);

      expect(result1.risk_profile).toBe(result2.risk_profile);
      expect(result1.allocation).toEqual(result2.allocation);
      expect(result1.projection).toEqual(result2.projection);
    });
  });

  describe('getUserHistory', () => {
    it('should retrieve user history ordered by creation date', async () => {
      const userId = 'test-user-123';
      const mockHistory = [
        {
          id: '1',
          user_id: userId,
          created_at: new Date('2026-03-04'),
        },
        {
          id: '2',
          user_id: userId,
          created_at: new Date('2026-03-03'),
        },
      ];

      mockRepository.find.mockResolvedValue(mockHistory);

      const history = await service.getUserHistory(userId);

      expect(mockRepository.find).toHaveBeenCalledWith({
        where: { user_id: userId },
        order: { created_at: 'DESC' },
        take: 10,
      });
      expect(history).toHaveLength(2);
    });

    it('should limit history to 10 records', async () => {
      const userId = 'test-user-123';

      await service.getUserHistory(userId);

      expect(mockRepository.find).toHaveBeenCalledWith(
        expect.objectContaining({
          take: 10,
        }),
      );
    });
  });

  describe('Real-time recalculation scenarios', () => {
    it('should recalculate accurately when adjusting capital via slider', async () => {
      const amounts = [50000, 100000, 150000, 200000, 300000];

      for (const amount of amounts) {
        const input = { ...mockUserInput, initial_capital: amount };
        const result = await service.runSimulation(input);

        expect(result.capital_distribution.Stocks).toBeCloseTo(amount * 0.5, 0); // 50% allocation
      }
    });

    it('should recalculate accurately when adjusting monthly contribution', async () => {
      const contributions = [0, 5000, 10000, 15000];

      for (const contrib of contributions) {
        const input = { ...mockUserInput, monthly_contribution: contrib };
        const result = await service.runSimulation(input);

        expect(result.projection).toBeDefined();
        expect(result.yearly_projection).toBeDefined();
      }
    });

    it('should recalculate accurately when adjusting duration', async () => {
      const durations = [1, 5, 10, 30, 50];

      for (const duration of durations) {
        const input = { ...mockUserInput, duration_years: duration };
        const result = await service.runSimulation(input);

        expect(result.yearly_projection.length).toBeGreaterThan(0);
      }
    });

    it('should recalculate accurately when adjusting risk tolerance', async () => {
      const riskLevels: ('Low' | 'Medium' | 'High')[] = [
        'Low',
        'Medium',
        'High',
      ];

      for (const risk of riskLevels) {
        const input = { ...mockUserInput, risk_tolerance: risk };
        const result = await service.runSimulation(input);

        expect(mockRiskEngine.calculateRiskProfile).toHaveBeenCalledWith(
          expect.anything(),
          expect.anything(),
          risk,
          expect.anything(),
        );
        expect(result.allocation).toBeDefined();
      }
    });
  });

  describe('Performance and optimization', () => {
    it('should return results without page reload (synchronously)', async () => {
      const startTime = Date.now();
      const result = await service.runSimulation(mockUserInput);
      const endTime = Date.now();

      expect(result).toBeDefined();
      // Should complete quickly (under 1 second in tests)
      expect(endTime - startTime).toBeLessThan(1000);
    });

    it('should handle concurrent simulation requests', async () => {
      const promises = Array.from({ length: 10 }, (_, i) => ({
        ...mockUserInput,
        initial_capital: 100000 + i * 10000,
      })).map((input) => service.runSimulation(input));

      const results = await Promise.all(promises);

      expect(results).toHaveLength(10);
      results.forEach((result) => {
        expect(result.risk_profile).toBeDefined();
        expect(result.projection).toBeDefined();
      });
    });
  });
});
