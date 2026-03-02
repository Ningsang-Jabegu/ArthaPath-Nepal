import { InvestmentCategoryService } from './investment-category.service';
import { InvestmentCategory } from '../entities/investment-category.entity';
import { FilterInvestmentCategoryDto } from './dto/filter-investment-category.dto';
export declare class InvestmentCategoryController {
    private readonly investmentCategoryService;
    constructor(investmentCategoryService: InvestmentCategoryService);
    getAllCategories(): Promise<InvestmentCategory[]>;
    filterCategories(filterDto: FilterInvestmentCategoryDto): Promise<InvestmentCategory[]>;
}
