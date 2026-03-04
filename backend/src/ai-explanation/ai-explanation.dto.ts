import { IsString, IsNumber, IsObject, IsOptional, ValidateNested, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';

class ProjectionDataDto {
  @IsNumber()
  conservative: number;

  @IsNumber()
  expected: number;

  @IsNumber()
  optimistic: number;

  @IsNumber()
  total_contributions: number;
}

export class AiExplanationRequestDto {
  @IsString()
  risk_profile: string;

  @IsObject()
  allocation: Record<string, number>;

  @IsObject()
  capital_distribution: Record<string, number>;

  @ValidateNested()
  @Type(() => ProjectionDataDto)
  projection: ProjectionDataDto;

  @IsNumber()
  time_horizon: number;

  @IsNumber()
  @IsOptional()
  monthly_contribution?: number = 0;

  @IsEnum(['LOW', 'MEDIUM', 'HIGH'])
  risk_tolerance: string;

  @IsEnum(['LOW', 'MEDIUM', 'HIGH'])
  liquidity_need: string;

  @IsEnum(['allocation', 'risk_profile', 'time_horizon', 'narrative'])
  @IsOptional()
  explanation_type?: string = 'narrative';
}

export class AiExplanationResponseDto {
  explanation: string;
  type: string;
  generated_at: Date;
  model: string;
}
