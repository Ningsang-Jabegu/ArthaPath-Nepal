export declare class UserInputDto {
    initial_capital: number;
    monthly_contribution: number;
    duration_years: number;
    risk_tolerance: 'Low' | 'Medium' | 'High';
    liquidity_need: 'Low' | 'Medium' | 'High';
    has_emergency_fund: boolean;
}
