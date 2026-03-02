import { Controller, Get, Query, ValidationPipe } from '@nestjs/common';
import { InvestmentCategoryService } from './investment-category.service';
import { InvestmentCategory } from '../entities/investment-category.entity';
import { FilterInvestmentCategoryDto } from './dto/filter-investment-category.dto';

@Controller('investment-categories')
export class InvestmentCategoryController {
  constructor(
    private readonly investmentCategoryService: InvestmentCategoryService,
  ) {}

  @Get()
  async getAllCategories(): Promise<InvestmentCategory[]> {
    return this.investmentCategoryService.findAll();
  }

  @Get('filter')
  async filterCategories(
    @Query(ValidationPipe) filterDto: FilterInvestmentCategoryDto,
  ): Promise<InvestmentCategory[]> {
    return this.investmentCategoryService.filter(filterDto);
  }
}