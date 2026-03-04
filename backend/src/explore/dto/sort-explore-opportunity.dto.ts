import { IsOptional, IsEnum } from 'class-validator';

export enum SortBy {
  RISK_ASC = 'risk_asc',
  RISK_DESC = 'risk_desc',
  RETURN_ASC = 'return_asc',
  RETURN_DESC = 'return_desc',
  LIQUIDITY_ASC = 'liquidity_asc',
  LIQUIDITY_DESC = 'liquidity_desc',
  NAME_ASC = 'name_asc',
  NAME_DESC = 'name_desc',
}

export class SortExploreOpportunityDto {
  @IsOptional()
  @IsEnum(SortBy)
  sort_by?: SortBy = SortBy.RISK_ASC;
}
