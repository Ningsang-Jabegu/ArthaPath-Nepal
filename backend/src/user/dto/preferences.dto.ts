import { IsEnum, IsBoolean, IsOptional } from 'class-validator';

enum RiskTolerance {
  Low = 'Low',
  Medium = 'Medium',
  High = 'High',
}

enum LiquidityNeed {
  Low = 'Low',
  Medium = 'Medium',
  High = 'High',
}

export class CreatePreferencesDto {
  @IsEnum(RiskTolerance)
  risk_tolerance: 'Low' | 'Medium' | 'High';

  @IsEnum(LiquidityNeed)
  liquidity_need: 'Low' | 'Medium' | 'High';

  @IsBoolean()
  has_emergency_fund: boolean;
}

export class UpdatePreferencesDto {
  @IsOptional()
  @IsEnum(RiskTolerance)
  risk_tolerance?: 'Low' | 'Medium' | 'High';

  @IsOptional()
  @IsEnum(LiquidityNeed)
  liquidity_need?: 'Low' | 'Medium' | 'High';

  @IsOptional()
  @IsBoolean()
  has_emergency_fund?: boolean;
}
