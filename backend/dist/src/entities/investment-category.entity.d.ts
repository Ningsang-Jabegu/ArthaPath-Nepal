export declare class InvestmentCategory {
    id: string;
    name: string;
    type: 'Stocks' | 'Mutual Fund' | 'Bond' | 'FD' | 'Gold' | 'Real Estate' | 'Business';
    expected_return_min: number;
    expected_return_max: number;
    risk_level: 'Low' | 'Medium' | 'High';
    liquidity_score: number;
    lock_in_period: string;
    minimum_capital: number;
    description: string;
    created_at: Date;
    updated_at: Date;
}
