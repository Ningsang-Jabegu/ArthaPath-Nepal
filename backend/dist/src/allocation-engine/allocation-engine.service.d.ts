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
export declare class AllocationEngineService {
    generateAllocation(riskProfile: RiskProfile, durationYears: number, initialCapital: number): AllocationResult;
    private getBaseAllocation;
    private adjustForLongTerm;
    private adjustForShortTerm;
    private redistributeZeroCategories;
    private normalizeAllocation;
    calculateCapitalDistribution(allocation: AllocationResult, totalCapital: number): Record<string, number>;
}
