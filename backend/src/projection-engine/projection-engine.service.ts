import { Injectable } from '@nestjs/common';
import { RiskProfile } from '../risk-engine/risk-engine.service';

export interface ProjectionResult {
  conservative: number;
  expected: number;
  optimistic: number;
  total_contributions: number;
  estimated_gain_conservative: number;
  estimated_gain_expected: number;
  estimated_gain_optimistic: number;
}

@Injectable()
export class ProjectionEngineService {
  /**
   * Calculate compound growth projections
   * Returns three scenarios: conservative, expected, optimistic
   */
  calculateProjection(
    initialCapital: number,
    monthlyContribution: number,
    durationYears: number,
    riskProfile: RiskProfile,
  ): ProjectionResult {
    const returnRates = this.getReturnRates(riskProfile);

    const conservative = this.calculateFutureValue(
      initialCapital,
      monthlyContribution,
      durationYears,
      returnRates.conservative,
    );

    const expected = this.calculateFutureValue(
      initialCapital,
      monthlyContribution,
      durationYears,
      returnRates.expected,
    );

    const optimistic = this.calculateFutureValue(
      initialCapital,
      monthlyContribution,
      durationYears,
      returnRates.optimistic,
    );

    const totalContributions =
      initialCapital + monthlyContribution * 12 * durationYears;

    return {
      conservative: Math.round(conservative),
      expected: Math.round(expected),
      optimistic: Math.round(optimistic),
      total_contributions: totalContributions,
      estimated_gain_conservative: Math.round(conservative - totalContributions),
      estimated_gain_expected: Math.round(expected - totalContributions),
      estimated_gain_optimistic: Math.round(optimistic - totalContributions),
    };
  }

  /**
   * Get return rate ranges based on risk profile
   */
  private getReturnRates(riskProfile: RiskProfile): {
    conservative: number;
    expected: number;
    optimistic: number;
  } {
    switch (riskProfile) {
      case 'Conservative':
        return {
          conservative: 0.06, // 6% per year
          expected: 0.08, // 8% per year
          optimistic: 0.10, // 10% per year
        };
      case 'Balanced':
        return {
          conservative: 0.08, // 8% per year
          expected: 0.11, // 11% per year
          optimistic: 0.14, // 14% per year
        };
      case 'Aggressive':
        return {
          conservative: 0.10, // 10% per year
          expected: 0.14, // 14% per year
          optimistic: 0.18, // 18% per year
        };
    }
  }

  /**
   * Calculate future value with compound interest
   * Formula: FV = P(1+r)^t + PMT * [((1+r)^t - 1) / r]
   * P = Principal (initial capital)
   * r = Annual interest rate (converted to monthly)
   * t = Time period in months
   * PMT = Monthly contribution
   */
  private calculateFutureValue(
    principal: number,
    monthlyContribution: number,
    years: number,
    annualRate: number,
  ): number {
    const monthlyRate = annualRate / 12;
    const months = years * 12;

    // Future value of principal with compound interest
    const fvPrincipal = principal * Math.pow(1 + monthlyRate, months);

    // Future value of monthly contributions (annuity)
    let fvContributions = 0;
    if (monthlyContribution > 0 && monthlyRate > 0) {
      fvContributions =
        monthlyContribution *
        ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);
    }

    return fvPrincipal + fvContributions;
  }

  /**
   * Generate year-by-year projection data for charts
   */
  generateYearlyProjection(
    initialCapital: number,
    monthlyContribution: number,
    durationYears: number,
    riskProfile: RiskProfile,
  ): Array<{
    year: number;
    conservative: number;
    expected: number;
    optimistic: number;
  }> {
    const returnRates = this.getReturnRates(riskProfile);
    const yearlyData: Array<{
      year: number;
      conservative: number;
      expected: number;
      optimistic: number;
    }> = [];

    for (let year = 0; year <= durationYears; year++) {
      yearlyData.push({
        year,
        conservative: Math.round(
          this.calculateFutureValue(
            initialCapital,
            monthlyContribution,
            year,
            returnRates.conservative,
          ),
        ),
        expected: Math.round(
          this.calculateFutureValue(
            initialCapital,
            monthlyContribution,
            year,
            returnRates.expected,
          ),
        ),
        optimistic: Math.round(
          this.calculateFutureValue(
            initialCapital,
            monthlyContribution,
            year,
            returnRates.optimistic,
          ),
        ),
      });
    }

    return yearlyData;
  }
}
