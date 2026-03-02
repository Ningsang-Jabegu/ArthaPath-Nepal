export type RiskProfile = 'Conservative' | 'Balanced' | 'Aggressive';
export declare class RiskEngineService {
    calculateRiskProfile(durationYears: number, liquidityNeed: 'Low' | 'Medium' | 'High', riskTolerance: 'Low' | 'Medium' | 'High', hasEmergencyFund: boolean): RiskProfile;
}
