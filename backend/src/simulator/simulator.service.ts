import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserInputDto } from './dto/user-input.dto';
import { SimulationHistory } from '../entities/simulation-history.entity';
import { RiskEngineService, RiskProfile } from '../risk-engine/risk-engine.service';
import {
  AllocationEngineService,
  AllocationResult,
} from '../allocation-engine/allocation-engine.service';
import {
  ProjectionEngineService,
  ProjectionResult,
} from '../projection-engine/projection-engine.service';

export interface SimulationResult {
  risk_profile: RiskProfile;
  allocation: AllocationResult;
  capital_distribution: Record<string, number>;
  projection: ProjectionResult;
  yearly_projection: Array<{
    year: number;
    conservative: number;
    expected: number;
    optimistic: number;
  }>;
}

@Injectable()
export class SimulatorService {
  constructor(
    @InjectRepository(SimulationHistory)
    private simulationHistoryRepository: Repository<SimulationHistory>,
    private riskEngineService: RiskEngineService,
    private allocationEngineService: AllocationEngineService,
    private projectionEngineService: ProjectionEngineService,
  ) {}

  /**
   * Main simulation flow
   */
  async runSimulation(
    userInput: UserInputDto,
    userId?: string,
  ): Promise<SimulationResult> {
    // Step 1: Calculate risk profile
    const riskProfile = this.riskEngineService.calculateRiskProfile(
      userInput.duration_years,
      userInput.liquidity_need,
      userInput.risk_tolerance,
      userInput.has_emergency_fund,
    );

    // Step 2: Generate allocation
    const allocation = this.allocationEngineService.generateAllocation(
      riskProfile,
      userInput.duration_years,
      userInput.initial_capital,
    );

    // Step 3: Calculate capital distribution
    const capitalDistribution =
      this.allocationEngineService.calculateCapitalDistribution(
        allocation,
        userInput.initial_capital,
      );

    // Step 4: Calculate projections
    const projection = this.projectionEngineService.calculateProjection(
      userInput.initial_capital,
      userInput.monthly_contribution,
      userInput.duration_years,
      riskProfile,
    );

    // Step 5: Generate yearly projection for charts
    const yearlyProjection =
      this.projectionEngineService.generateYearlyProjection(
        userInput.initial_capital,
        userInput.monthly_contribution,
        userInput.duration_years,
        riskProfile,
      );

    // Step 6: Save to history (if user is logged in)
    if (userId) {
      await this.saveToHistory(
        userId,
        userInput,
        riskProfile,
        allocation,
        projection,
      );
    }

    return {
      risk_profile: riskProfile,
      allocation,
      capital_distribution: capitalDistribution,
      projection,
      yearly_projection: yearlyProjection,
    };
  }

  /**
   * Save simulation to history
   */
  private async saveToHistory(
    userId: string,
    userInput: UserInputDto,
    riskProfile: RiskProfile,
    allocation: AllocationResult,
    projection: ProjectionResult,
  ): Promise<void> {
    const history = new SimulationHistory();
    history.user_id = userId;
    history.initial_capital = userInput.initial_capital;
    history.monthly_contribution = userInput.monthly_contribution;
    history.duration_years = userInput.duration_years;
    history.risk_tolerance = userInput.risk_tolerance;
    history.liquidity_need = userInput.liquidity_need;
    history.has_emergency_fund = userInput.has_emergency_fund;
    history.risk_profile = riskProfile;
    history.allocation_result = allocation as any;
    history.projection_result = {
      conservative: projection.conservative,
      expected: projection.expected,
      optimistic: projection.optimistic,
      total_contributions: projection.total_contributions,
    };

    await this.simulationHistoryRepository.save(history);
  }

  /**
   * Get user's simulation history
   */
  async getUserHistory(userId: string): Promise<SimulationHistory[]> {
    return this.simulationHistoryRepository.find({
      where: { user_id: userId },
      order: { created_at: 'DESC' },
      take: 10,
    });
  }
}
