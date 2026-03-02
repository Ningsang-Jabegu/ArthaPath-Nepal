import { User } from './user.entity';
export declare class UserPreference {
    id: string;
    user: User;
    user_id: string;
    risk_tolerance: 'Low' | 'Medium' | 'High';
    liquidity_need: 'Low' | 'Medium' | 'High';
    has_emergency_fund: boolean;
    created_at: Date;
    updated_at: Date;
}
