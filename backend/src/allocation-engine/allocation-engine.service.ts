import { Injectable } from '@nestjs/common';
import { RiskProfile } from '../risk-engine/risk-engine.service';

export interface AllocationResult {
  'Mutual Fund': number;
  Stocks: number;
  'Fixed Deposit': number;
  Bonds: number;
  Gold: number;
  'Real Estate': number;
  Business: number;
}

@Injectable()
export class AllocationEngineService {
  /**
   * Generate allocation percentages based on risk profile and duration
   */
  generateAllocation(
    riskProfile: RiskProfile,
    durationYears: number,
    initialCapital: number,
  ): AllocationResult {
    let baseAllocation = this.getBaseAllocation(riskProfile);

    // Adjust for time horizon
    if (durationYears >= 15) {
      // Long-term: increase growth assets
      baseAllocation = this.adjustForLongTerm(baseAllocation, riskProfile);
    } else if (durationYears < 5) {
      // Short-term: increase stable assets
      baseAllocation = this.adjustForShortTerm(baseAllocation);
    }

    // Adjust for capital size
    if (initialCapital < 50000) {
      // Smaller capital: simplify allocation, avoid real estate
      baseAllocation['Real Estate'] = 0;
      baseAllocation = this.redistributeZeroCategories(baseAllocation);
    }

    return this.normalizeAllocation(baseAllocation);
  }

  /**
   * Get base allocation percentages for each risk profile
   */
  private getBaseAllocation(riskProfile: RiskProfile): AllocationResult {
    switch (riskProfile) {
      case 'Conservative':
        return {
          'Mutual Fund': 25,
          Stocks: 10,
          'Fixed Deposit': 40,
          Bonds: 15,
          Gold: 10,
          'Real Estate': 0,
          Business: 0,
        };
      case 'Balanced':
        return {
          'Mutual Fund': 35,
          Stocks: 25,
          'Fixed Deposit': 20,
          Bonds: 10,
          Gold: 10,
          'Real Estate': 0,
          Business: 0,
        };
      case 'Aggressive':
        return {
          'Mutual Fund': 25,
          Stocks: 50,
          'Fixed Deposit': 10,
          Bonds: 5,
          Gold: 5,
          'Real Estate': 0,
          Business: 5,
        };
    }
  }

  /**
   * Adjust allocation for long-term investment (15+ years)
   */
  private adjustForLongTerm(
    allocation: AllocationResult,
    riskProfile: RiskProfile,
  ): AllocationResult {
    if (riskProfile === 'Conservative') {
      allocation.Stocks += 5;
      allocation['Mutual Fund'] += 5;
      allocation['Fixed Deposit'] -= 10;
    } else if (riskProfile === 'Balanced') {
      allocation.Stocks += 10;
      allocation['Fixed Deposit'] -= 10;
    } else {
      allocation.Stocks += 5;
      allocation.Business += 5;
      allocation['Fixed Deposit'] -= 10;
    }
    return allocation;
  }

  /**
   * Adjust allocation for short-term investment (<5 years)
   */
  private adjustForShortTerm(allocation: AllocationResult): AllocationResult {
    const stockReduction = Math.floor(allocation.Stocks * 0.3);
    const businessReduction = allocation.Business;

    allocation.Stocks -= stockReduction;
    allocation.Business = 0;
    allocation['Fixed Deposit'] += stockReduction + businessReduction;

    return allocation;
  }

  /**
   * Redistribute percentages when a category is set to 0
   */
  private redistributeZeroCategories(
    allocation: AllocationResult,
  ): AllocationResult {
    const activeCategories = Object.keys(allocation).filter(
      (key) => allocation[key as keyof AllocationResult] > 0,
    );

    if (activeCategories.length === 0) return allocation;

    const totalActive = activeCategories.reduce(
      (sum, key) => sum + allocation[key as keyof AllocationResult],
      0,
    );

    const scaleFactor = 100 / totalActive;

    activeCategories.forEach((key) => {
      allocation[key as keyof AllocationResult] = Math.round(
        allocation[key as keyof AllocationResult] * scaleFactor,
      );
    });

    return allocation;
  }

  /**
   * Ensure all allocations sum to 100%
   */
  private normalizeAllocation(allocation: AllocationResult): AllocationResult {
    const total = Object.values(allocation).reduce((sum, val) => sum + val, 0);

    if (total === 100) return allocation;

    const diff = 100 - total;
    const largestKey = Object.keys(allocation).reduce((a, b) =>
      allocation[a as keyof AllocationResult] >
      allocation[b as keyof AllocationResult]
        ? a
        : b,
    ) as keyof AllocationResult;

    allocation[largestKey] += diff;

    return allocation;
  }

  /**
   * Calculate capital distribution based on percentages
   */
  calculateCapitalDistribution(
    allocation: AllocationResult,
    totalCapital: number,
  ): Record<string, number> {
    const distribution: Record<string, number> = {};

    Object.keys(allocation).forEach((category) => {
      const percentage = allocation[category as keyof AllocationResult];
      distribution[category] = Math.round((percentage / 100) * totalCapital);
    });

    return distribution;
  }
}
