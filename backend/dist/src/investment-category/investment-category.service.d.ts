import { OnModuleInit } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InvestmentCategory } from '../entities/investment-category.entity';
import { FilterInvestmentCategoryDto } from './dto/filter-investment-category.dto';
import { AuditService, IAuditContext } from '../audit/audit.service';
export declare class InvestmentCategoryService implements OnModuleInit {
    private readonly investmentCategoryRepository;
    private readonly auditService;
    constructor(investmentCategoryRepository: Repository<InvestmentCategory>, auditService: AuditService);
    onModuleInit(): Promise<void>;
    findAll(): Promise<InvestmentCategory[]>;
    filter(filterDto: FilterInvestmentCategoryDto): Promise<InvestmentCategory[]>;
    private seedCategoriesIfEmpty;
    updateCategory(id: string, updateData: Partial<InvestmentCategory>, auditContext?: IAuditContext): Promise<InvestmentCategory>;
    deleteCategory(id: string, auditContext?: IAuditContext): Promise<void>;
    getCategoryHistory(id: string): Promise<{
        totalChanges: number;
        createdAt: Date | null;
        lastModifiedAt: Date | null;
        lastModifiedBy: string | null;
        changeLog: Array<{
            action: import("../entities/audit-log.entity").AuditAction;
            timestamp: Date;
            user: string;
            changes: string;
        }>;
    }>;
    private getChangedFields;
}
