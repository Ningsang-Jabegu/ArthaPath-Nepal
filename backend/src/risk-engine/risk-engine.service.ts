import { Injectable } from '@nestjs/common';

export type RiskProfile = 'Conservative' | 'Balanced' | 'Aggressive';

@Injectable()
export class RiskEngineService {
  /**
   * Calculate risk profile based on user inputs
   * Returns: Conservative, Balanced, or Aggressive
   */
  calculateRiskProfile(
    durationYears: number,
    liquidityNeed: 'Low' | 'Medium' | 'High',
    riskTolerance: 'Low' | 'Medium' | 'High',
    hasEmergencyFund: boolean,
  ): RiskProfile {
    let riskScore = 0;

    // Time horizon scoring (0-40 points)
    if (durationYears >= 15) {
      riskScore += 40;
    } else if (durationYears >= 10) {
      riskScore += 30;
    } else if (durationYears >= 5) {
      riskScore += 20;
    } else {
      riskScore += 10;
    }

    // Liquidity need scoring (0-20 points) - inverse scoring
    if (liquidityNeed === 'Low') {
      riskScore += 20;
    } else if (liquidityNeed === 'Medium') {
      riskScore += 10;
    } else {
      riskScore += 0;
    }

    // Risk tolerance scoring (0-30 points)
    if (riskTolerance === 'High') {
      riskScore += 30;
    } else if (riskTolerance === 'Medium') {
      riskScore += 15;
    } else {
      riskScore += 0;
    }

    // Emergency fund bonus (0-10 points)
    if (hasEmergencyFund) {
      riskScore += 10;
    }

    // Total possible: 100 points
    // Conservative: 0-35
    // Balanced: 36-65
    // Aggressive: 66-100

    if (riskScore <= 35) {
      return 'Conservative';
    } else if (riskScore <= 65) {
      return 'Balanced';
    } else {
      return 'Aggressive';
    }
  }
}
