import { IsString, IsNotEmpty, IsOptional, IsInt, Min, Max, IsEnum, IsBoolean, IsObject } from 'class-validator';

export class SavePlanDto {
  @IsString()
  @IsNotEmpty()
  plan_name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsInt()
  @Min(1000)
  initial_capital: number;

  @IsInt()
  @Min(0)
  monthly_contribution: number;

  @IsInt()
  @Min(1)
  @Max(50)
  duration_years: number;

  @IsEnum(['Low', 'Medium', 'High'])
  risk_tolerance: 'Low' | 'Medium' | 'High';

  @IsEnum(['Low', 'Medium', 'High'])
  liquidity_need: 'Low' | 'Medium' | 'High';

  @IsBoolean()
  has_emergency_fund: boolean;

  @IsEnum(['CONSERVATIVE', 'BALANCED', 'AGGRESSIVE'])
  risk_profile: 'CONSERVATIVE' | 'BALANCED' | 'AGGRESSIVE';

  @IsObject()
  allocation: Record<string, number>;

  @IsObject()
  capital_distribution: Record<string, number>;

  @IsObject()
  projection: {
    conservative: number;
    expected: number;
    optimistic: number;
    total_contributions: number;
  };
}

export class UpdatePlanDto {
  @IsString()
  @IsOptional()
  plan_name?: string;

  @IsString()
  @IsOptional()
  description?: string;
}

export class SavedPlanResponseDto {
  id: string;
  user_id: string;
  plan_name: string;
  description: string | null;
  initial_capital: number;
  monthly_contribution: number;
  duration_years: number;
  risk_tolerance: 'Low' | 'Medium' | 'High';
  liquidity_need: 'Low' | 'Medium' | 'High';
  has_emergency_fund: boolean;
  risk_profile: 'CONSERVATIVE' | 'BALANCED' | 'AGGRESSIVE';
  allocation: Record<string, number>;
  capital_distribution: Record<string, number>;
  projection: {
    conservative: number;
    expected: number;
    optimistic: number;
    total_contributions: number;
  };
  created_at: Date;
  updated_at: Date;
}
