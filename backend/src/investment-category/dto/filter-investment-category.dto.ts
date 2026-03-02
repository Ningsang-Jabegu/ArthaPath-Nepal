import { Type } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, Min } from 'class-validator';

export class FilterInvestmentCategoryDto {
  @IsOptional()
  @IsEnum(['Stocks', 'Mutual Fund', 'Bond', 'FD', 'Gold', 'Real Estate', 'Business'])
  type?: 'Stocks' | 'Mutual Fund' | 'Bond' | 'FD' | 'Gold' | 'Real Estate' | 'Business';

  @IsOptional()
  @IsEnum(['Low', 'Medium', 'High'])
  risk_level?: 'Low' | 'Medium' | 'High';

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  min_return?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  max_return?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  min_liquidity_score?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  max_minimum_capital?: number;
}