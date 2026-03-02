export declare class FilterInvestmentCategoryDto {
    type?: 'Stocks' | 'Mutual Fund' | 'Bond' | 'FD' | 'Gold' | 'Real Estate' | 'Business';
    risk_level?: 'Low' | 'Medium' | 'High';
    min_return?: number;
    max_return?: number;
    min_liquidity_score?: number;
    max_minimum_capital?: number;
}
