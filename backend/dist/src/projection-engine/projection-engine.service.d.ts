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
export declare class ProjectionEngineService {
    calculateProjection(initialCapital: number, monthlyContribution: number, durationYears: number, riskProfile: RiskProfile): ProjectionResult;
    private getReturnRates;
    private calculateFutureValue;
    generateYearlyProjection(initialCapital: number, monthlyContribution: number, durationYears: number, riskProfile: RiskProfile): Array<{
        year: number;
        conservative: number;
        expected: number;
        optimistic: number;
    }>;
}
