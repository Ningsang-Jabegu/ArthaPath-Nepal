/**
 * Optimized response DTO for listing investment categories
 * Excludes long descriptions to reduce payload size
 */
export class InvestmentCategoryListDto {
  id: string;
  name: string;
  type: string;
  risk_level: string;
  expected_return_min: number;
  expected_return_max: number;
  liquidity_score: number;
  lock_in_period_months: number;
  minimum_capital: number;
}

/**
 * Full response DTO for getting a single investment category
 */
export class InvestmentCategoryDetailDto {
  id: string;
  name: string;
  type: string;
  risk_level: string;
  expected_return_min: number;
  expected_return_max: number;
  liquidity_score: number;
  lock_in_period_months: number;
  minimum_capital: number;
  description: string;
  created_at: Date;
  updated_at: Date;
}
