import { IsEnum, IsOptional } from 'class-validator';
import type { EducationCategory } from '../../entities/education-article.entity';

export class FilterEducationArticleDto {
  @IsOptional()
  @IsEnum([
    'Stocks',
    'Mutual Fund',
    'Bond',
    'Fixed Deposit',
    'Gold',
    'Real Estate',
    'Business',
    'General',
  ])
  category?: EducationCategory;
}
