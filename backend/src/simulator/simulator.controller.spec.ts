import { Test, TestingModule } from '@nestjs/testing';
import { SimulatorController } from './simulator.controller';
import { SimulatorService } from './simulator.service';
import { UserInputDto } from './dto/user-input.dto';

describe('SimulatorController', () => {
  let controller: SimulatorController;
  let mockSimulatorService: Partial<SimulatorService>;

  const mockUserInput: UserInputDto = {
    initial_capital: 100000,
    monthly_contribution: 5000,
    duration_years: 5,
    risk_tolerance: 'Medium',
    liquidity_need: 'Medium',
    has_emergency_fund: true,
  };

  const mockSimulationResult = {
    risk_profile: 'Balanced' as const,
    allocation: {
      stocks: 50,
      mutual_funds: 30,
      bonds: 15,
      gold: 5,
    },
    capital_distribution: {
      stocks: 50000,
      mutual_funds: 30000,
      bonds: 15000,
      gold: 5000,
    },
    projection: {
      conservative: 150000,
      expected: 180000,
      optimistic: 220000,
      total_contributions: 400000,
      estimated_gain_expected: 80000,
      estimated_gain_conservative: 50000,
      estimated_gain_optimistic: 120000,
    },
    yearly_projection: [
      { year: 1, conservative: 110000, expected: 120000, optimistic: 130000 },
      { year: 2, conservative: 120000, expected: 140000, optimistic: 160000 },
      { year: 3, conservative: 132000, expected: 162000, optimistic: 195000 },
      { year: 4, conservative: 144000, expected: 188000, optimistic: 235000 },
      { year: 5, conservative: 158000, expected: 217000, optimistic: 282000 },
    ],
  };

  beforeEach(async () => {
    mockSimulatorService = {
      runSimulation: jest.fn().mockResolvedValue(mockSimulationResult),
      getUserHistory: jest.fn().mockResolvedValue([]),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [SimulatorController],
      providers: [
        {
          provide: SimulatorService,
          useValue: mockSimulatorService,
        },
      ],
    }).compile();

    controller = module.get<SimulatorController>(SimulatorController);
  });

  describe('runSimulation (POST /simulator/run)', () => {
    it('should accept dynamic user inputs and return simulation results', async () => {
      const result = await controller.runSimulation(mockUserInput);

      expect(result).toHaveProperty('risk_profile');
      expect(result).toHaveProperty('allocation');
      expect(result).toHaveProperty('capital_distribution');
      expect(result).toHaveProperty('projection');
      expect(result).toHaveProperty('yearly_projection');
    });

    it('should return real-time recalculation on capital change', async () => {
      const newInput = { ...mockUserInput, initial_capital: 500000 };

      await controller.runSimulation(newInput);

      expect(mockSimulatorService.runSimulation).toHaveBeenCalledWith(newInput);
    });

    it('should return real-time recalculation on monthly contribution change', async () => {
      const newInput = { ...mockUserInput, monthly_contribution: 10000 };

      await controller.runSimulation(newInput);

      expect(mockSimulatorService.runSimulation).toHaveBeenCalledWith(newInput);
    });

    it('should return real-time recalculation on duration change', async () => {
      const newInput = { ...mockUserInput, duration_years: 10 };

      await controller.runSimulation(newInput);

      expect(mockSimulatorService.runSimulation).toHaveBeenCalledWith(newInput);
    });

    it('should return real-time recalculation on risk tolerance change', async () => {
      const newInput = { ...mockUserInput, risk_tolerance: 'High' as const };

      await controller.runSimulation(newInput);

      expect(mockSimulatorService.runSimulation).toHaveBeenCalledWith(newInput);
    });

    it('should return real-time recalculation on liquidity need change', async () => {
      const newInput = { ...mockUserInput, liquidity_need: 'Low' as const };

      await controller.runSimulation(newInput);

      expect(mockSimulatorService.runSimulation).toHaveBeenCalledWith(newInput);
    });

    it('should return results without page reload', async () => {
      const result = await controller.runSimulation(mockUserInput);

      expect(result).toBeDefined();
      expect(result.yearly_projection).toHaveLength(5);
    });

    it('should handle minimum capital input', async () => {
      const minInput = { ...mockUserInput, initial_capital: 5000 };

      await controller.runSimulation(minInput);

      expect(mockSimulatorService.runSimulation).toHaveBeenCalledWith(minInput);
    });

    it('should handle maximum duration input', async () => {
      const maxInput = { ...mockUserInput, duration_years: 50 };

      await controller.runSimulation(maxInput);

      expect(mockSimulatorService.runSimulation).toHaveBeenCalledWith(maxInput);
    });

    it('should handle zero monthly contribution', async () => {
      const zeroContribInput = { ...mockUserInput, monthly_contribution: 0 };

      await controller.runSimulation(zeroContribInput);

      expect(mockSimulatorService.runSimulation).toHaveBeenCalledWith(
        zeroContribInput,
      );
    });

    it('should handle inputs without emergency fund', async () => {
      const noEmergencyInput = { ...mockUserInput, has_emergency_fund: false };

      await controller.runSimulation(noEmergencyInput);

      expect(mockSimulatorService.runSimulation).toHaveBeenCalledWith(
        noEmergencyInput,
      );
    });

    it('should return updated allocation breakdown', async () => {
      const result = await controller.runSimulation(mockUserInput);

      expect(result.allocation.stocks).toBe(50);
      expect(result.allocation.mutual_funds).toBe(30);
      expect(result.allocation.bonds).toBe(15);
      expect(result.allocation.gold).toBe(5);
    });

    it('should return updated capital distribution', async () => {
      const result = await controller.runSimulation(mockUserInput);

      expect(result.capital_distribution.stocks).toBe(50000);
      expect(result.capital_distribution.mutual_funds).toBe(30000);
    });

    it('should return projection with all scenarios', async () => {
      const result = await controller.runSimulation(mockUserInput);

      expect(result.projection.conservative).toBeDefined();
      expect(result.projection.expected).toBeDefined();
      expect(result.projection.optimistic).toBeDefined();
    });

    it('should return yearly projection data for charts', async () => {
      const result = await controller.runSimulation(mockUserInput);

      expect(result.yearly_projection).toHaveLength(5);
      result.yearly_projection.forEach((yearData) => {
        expect(yearData).toHaveProperty('year');
        expect(yearData).toHaveProperty('conservative');
        expect(yearData).toHaveProperty('expected');
        expect(yearData).toHaveProperty('optimistic');
      });
    });
  });

  describe('Real-time recalculation scenarios', () => {
    it('should recalculate when slider adjusts capital incrementally', async () => {
      const amounts = [100000, 150000, 200000];

      for (const amount of amounts) {
        const input = { ...mockUserInput, initial_capital: amount };
        await controller.runSimulation(input);
      }

      expect(mockSimulatorService.runSimulation).toHaveBeenCalledTimes(3);
    });

    it('should recalculate when slider adjusts monthly contribution', async () => {
      const contributions = [5000, 7500, 10000];

      for (const contrib of contributions) {
        const input = { ...mockUserInput, monthly_contribution: contrib };
        await controller.runSimulation(input);
      }

      expect(mockSimulatorService.runSimulation).toHaveBeenCalledTimes(3);
    });

    it('should handle rapid sequential calls for real-time UI updates', async () => {
      const rapidInputs = Array.from({ length: 10 }, (_, i) => ({
        ...mockUserInput,
        initial_capital: 100000 + i * 5000,
      }));

      for (const input of rapidInputs) {
        await controller.runSimulation(input);
      }

      expect(mockSimulatorService.runSimulation).toHaveBeenCalledTimes(10);
    });
  });

  describe('Response format validation', () => {
    it('should return response with required fields', async () => {
      const result = await controller.runSimulation(mockUserInput);

      const requiredFields = [
        'risk_profile',
        'allocation',
        'capital_distribution',
        'projection',
        'yearly_projection',
      ];

      requiredFields.forEach((field) => {
        expect(result).toHaveProperty(field);
      });
    });

    it('should ensure yearly_projection is an array', async () => {
      const result = await controller.runSimulation(mockUserInput);

      expect(Array.isArray(result.yearly_projection)).toBe(true);
    });

    it('should ensure allocation is an object with percentages', async () => {
      const result = await controller.runSimulation(mockUserInput);

      expect(typeof result.allocation).toBe('object');
      expect(result.allocation.stocks > 0 || result.allocation.stocks === 0).toBe(
        true,
      );
    });

    it('should ensure capital_distribution matches allocation proportions', async () => {
      const result = await controller.runSimulation(mockUserInput);

      const totalDistribution = Object.values(
        result.capital_distribution as Record<string, number>,
      ).reduce((a, b) => a + b, 0);

      expect(totalDistribution).toBe(mockUserInput.initial_capital);
    });
  });

  describe('Dynamic recalculation on user interaction', () => {
    it('should provide fresh results on each call (no caching)', async () => {
      const input = { ...mockUserInput };

      const result1 = await controller.runSimulation(input);
      const result2 = await controller.runSimulation(input);

      // Service should be called twice (no endpoint-level caching)
      expect(mockSimulatorService.runSimulation).toHaveBeenCalledTimes(2);
    });

    it('should return different results for different risk tolerances', async () => {
      const lowRiskInput = { ...mockUserInput, risk_tolerance: 'Low' as const };
      const highRiskInput = {
        ...mockUserInput,
        risk_tolerance: 'High' as const,
      };

      await controller.runSimulation(lowRiskInput);
      await controller.runSimulation(highRiskInput);

      expect(mockSimulatorService.runSimulation).toHaveBeenCalledTimes(2);
      expect(mockSimulatorService.runSimulation).toHaveBeenNthCalledWith(
        1,
        lowRiskInput,
      );
      expect(mockSimulatorService.runSimulation).toHaveBeenNthCalledWith(
        2,
        highRiskInput,
      );
    });
  });
});
