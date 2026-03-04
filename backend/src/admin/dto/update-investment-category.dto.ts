import { PartialType } from '@nestjs/mapped-types';
import { CreateInvestmentCategoryDto } from './create-investment-category.dto';

export class UpdateInvestmentCategoryDto extends PartialType(
  CreateInvestmentCategoryDto,
) {}
