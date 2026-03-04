import { IsEnum, IsNumber, IsString, Min, Max, IsNotEmpty } from 'class-validator';

export enum InvestmentType {
  STOCKS = 'Stocks',
  MUTUAL_FUND = 'Mutual Fund',
  BOND = 'Bond',
  FD = 'FD',
  GOLD = 'Gold',
  REAL_ESTATE = 'Real Estate',
  BUSINESS = 'Business',
}

export enum RiskLevel {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High',
}

export class CreateInvestmentCategoryDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEnum(InvestmentType)
  type: InvestmentType;

  @IsNumber()
  @Min(0)
  @Max(100)
  expected_return_min: number;

  @IsNumber()
  @Min(0)
  @Max(100)
  expected_return_max: number;

  @IsEnum(RiskLevel)
  risk_level: RiskLevel;

  @IsNumber()
  @Min(0)
  @Max(10)
  liquidity_score: number;

  @IsString()
  @IsNotEmpty()
  lock_in_period: string;

  @IsNumber()
  @Min(0)
  minimum_capital: number;

  @IsString()
  @IsNotEmpty()
  description: string;
}
