import { IsNumber, IsEnum, IsBoolean, Min, Max } from 'class-validator';

export class UserInputDto {
  @IsNumber()
  @Min(5000)
  initial_capital: number; // NPR

  @IsNumber()
  @Min(0)
  monthly_contribution: number; // NPR, optional (0 if not provided)

  @IsNumber()
  @Min(1)
  @Max(50)
  duration_years: number;

  @IsEnum(['Low', 'Medium', 'High'])
  risk_tolerance: 'Low' | 'Medium' | 'High';

  @IsEnum(['Low', 'Medium', 'High'])
  liquidity_need: 'Low' | 'Medium' | 'High';

  @IsBoolean()
  has_emergency_fund: boolean;
}
