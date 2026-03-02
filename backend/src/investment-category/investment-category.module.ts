import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InvestmentCategory } from '../entities/investment-category.entity';
import { InvestmentCategoryController } from './investment-category.controller';
import { InvestmentCategoryService } from './investment-category.service';

@Module({
  imports: [TypeOrmModule.forFeature([InvestmentCategory])],
  controllers: [InvestmentCategoryController],
  providers: [InvestmentCategoryService],
  exports: [InvestmentCategoryService],
})
export class InvestmentCategoryModule {}