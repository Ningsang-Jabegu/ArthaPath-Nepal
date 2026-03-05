"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const user_entity_1 = require("./user.entity");
id: string;
user: user_entity_1.User;
user_id: string;
initial_capital: number;
monthly_contribution: number;
duration_years: number;
risk_tolerance: 'Low' | 'Medium' | 'High';
liquidity_need: 'Low' | 'Medium' | 'High';
has_emergency_fund: boolean;
allocation_result: Record;
projection_result: {
    conservative: number;
    expected: number;
    optimistic: number;
    total_contributions: number;
}
;
risk_profile: 'Conservative' | 'Balanced' | 'Aggressive';
created_at: Date;
//# sourceMappingURL=simulation-history.entity.js.map