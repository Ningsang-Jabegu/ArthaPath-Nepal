import { OnModuleInit } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InvestmentCategory } from '../entities/investment-category.entity';
import { FilterInvestmentCategoryDto } from './dto/filter-investment-category.dto';
export declare class InvestmentCategoryService implements OnModuleInit {
    private readonly investmentCategoryRepository;
    constructor(investmentCategoryRepository: Repository<InvestmentCategory>);
    onModuleInit(): Promise<void>;
    findAll(): Promise<InvestmentCategory[]>;
    filter(filterDto: FilterInvestmentCategoryDto): Promise<InvestmentCategory[]>;
    private seedCategoriesIfEmpty;
}
