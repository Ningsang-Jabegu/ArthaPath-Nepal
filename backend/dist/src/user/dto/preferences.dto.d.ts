export declare class CreatePreferencesDto {
    risk_tolerance: 'Low' | 'Medium' | 'High';
    liquidity_need: 'Low' | 'Medium' | 'High';
    has_emergency_fund: boolean;
}
export declare class UpdatePreferencesDto {
    risk_tolerance?: 'Low' | 'Medium' | 'High';
    liquidity_need?: 'Low' | 'Medium' | 'High';
    has_emergency_fund?: boolean;
}
