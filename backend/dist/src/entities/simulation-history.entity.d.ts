import { User } from './user.entity';
export declare class SimulationHistory {
    id: string;
    user: User;
    user_id: string;
    initial_capital: number;
    monthly_contribution: number;
    duration_years: number;
    risk_tolerance: 'Low' | 'Medium' | 'High';
    liquidity_need: 'Low' | 'Medium' | 'High';
    has_emergency_fund: boolean;
    allocation_result: Record<string, number>;
    projection_result: {
        conservative: number;
        expected: number;
        optimistic: number;
        total_contributions: number;
    };
    risk_profile: 'Conservative' | 'Balanced' | 'Aggressive';
    created_at: Date;
}
