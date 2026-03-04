import { IsOptional, IsEnum, IsNumber, Min, Max, IsString } from 'class-validator';

export enum RiskLevelFilter {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High',
}

export enum InvestmentTypeFilter {
  STOCKS = 'Stocks',
  MUTUAL_FUND = 'Mutual Fund',
  BOND = 'Bond',
  FD = 'FD',
  GOLD = 'Gold',
  REAL_ESTATE = 'Real Estate',
  BUSINESS = 'Business',
}

export class FilterExploreOpportunityDto {
  @IsOptional()
  @IsEnum(RiskLevelFilter)
  risk_level?: RiskLevelFilter;

  @IsOptional()
  @IsEnum(InvestmentTypeFilter)
  investment_type?: InvestmentTypeFilter;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(10)
  min_liquidity_score?: number;

  @IsOptional()
  @IsString()
  lock_in_period?: string; // e.g., "None", "3 months", "1 year"

  @IsOptional()
  @IsNumber()
  @Min(0)
  max_minimum_capital?: number; // NPR
}
