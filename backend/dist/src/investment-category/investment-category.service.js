"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvestmentCategoryService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const investment_category_entity_1 = require("../entities/investment-category.entity");
const audit_service_1 = require("../audit/audit.service");
let InvestmentCategoryService = class InvestmentCategoryService {
    investmentCategoryRepository;
    auditService;
    constructor(investmentCategoryRepository, auditService) {
        this.investmentCategoryRepository = investmentCategoryRepository;
        this.auditService = auditService;
    }
    async onModuleInit() {
        await this.seedCategoriesIfEmpty();
    }
    async findAll() {
        return this.investmentCategoryRepository.find({
            select: [
                'id',
                'name',
                'type',
                'risk_level',
                'expected_return_min',
                'expected_return_max',
                'liquidity_score',
                'lock_in_period',
                'minimum_capital',
            ],
            order: { name: 'ASC' },
        });
    }
    async filter(filterDto) {
        const query = this.investmentCategoryRepository.createQueryBuilder('category');
        if (filterDto.type) {
            query.andWhere('category.type = :type', { type: filterDto.type });
        }
        if (filterDto.risk_level) {
            query.andWhere('category.risk_level = :riskLevel', {
                riskLevel: filterDto.risk_level,
            });
        }
        if (filterDto.min_return !== undefined) {
            query.andWhere('category.expected_return_max >= :minReturn', {
                minReturn: filterDto.min_return,
            });
        }
        if (filterDto.max_return !== undefined) {
            query.andWhere('category.expected_return_min <= :maxReturn', {
                maxReturn: filterDto.max_return,
            });
        }
        if (filterDto.min_liquidity_score !== undefined) {
            query.andWhere('category.liquidity_score >= :minLiquidityScore', {
                minLiquidityScore: filterDto.min_liquidity_score,
            });
        }
        if (filterDto.max_minimum_capital !== undefined) {
            query.andWhere('category.minimum_capital <= :maxMinimumCapital', {
                maxMinimumCapital: filterDto.max_minimum_capital,
            });
        }
        query.orderBy('category.name', 'ASC');
        return query.getMany();
    }
    async seedCategoriesIfEmpty() {
        const categoriesCount = await this.investmentCategoryRepository.count();
        if (categoriesCount > 0) {
            return;
        }
        const categories = [
            {
                name: 'Stocks',
                type: 'Stocks',
                expected_return_min: 10,
                expected_return_max: 20,
                risk_level: 'High',
                liquidity_score: 8,
                lock_in_period: 'None',
                minimum_capital: 5000,
                description: 'Equity investment in listed companies with high growth potential and higher volatility.',
            },
            {
                name: 'Mutual Funds',
                type: 'Mutual Fund',
                expected_return_min: 8,
                expected_return_max: 15,
                risk_level: 'Medium',
                liquidity_score: 7,
                lock_in_period: 'None to 3 years',
                minimum_capital: 1000,
                description: 'Professionally managed pooled investments suitable for diversification and gradual wealth building.',
            },
            {
                name: 'Bonds',
                type: 'Bond',
                expected_return_min: 6,
                expected_return_max: 10,
                risk_level: 'Low',
                liquidity_score: 6,
                lock_in_period: '1 to 5 years',
                minimum_capital: 10000,
                description: 'Fixed-income instruments offering relatively stable returns and lower risk than equities.',
            },
            {
                name: 'Fixed Deposit (FD)',
                type: 'FD',
                expected_return_min: 5,
                expected_return_max: 8,
                risk_level: 'Low',
                liquidity_score: 4,
                lock_in_period: '3 months to 5 years',
                minimum_capital: 1000,
                description: 'Bank deposit product with historically stable returns over a fixed tenure and relatively low capital risk.',
            },
            {
                name: 'Gold',
                type: 'Gold',
                expected_return_min: 4,
                expected_return_max: 12,
                risk_level: 'Medium',
                liquidity_score: 7,
                lock_in_period: 'None',
                minimum_capital: 5000,
                description: 'Traditional inflation-hedging asset that provides portfolio stability during market uncertainty.',
            },
            {
                name: 'Real Estate',
                type: 'Real Estate',
                expected_return_min: 7,
                expected_return_max: 14,
                risk_level: 'Medium',
                liquidity_score: 3,
                lock_in_period: '5+ years',
                minimum_capital: 500000,
                description: 'Property-based investment with long-term appreciation potential but lower liquidity.',
            },
            {
                name: 'Business',
                type: 'Business',
                expected_return_min: 12,
                expected_return_max: 30,
                risk_level: 'High',
                liquidity_score: 2,
                lock_in_period: '5+ years',
                minimum_capital: 100000,
                description: 'Direct ownership or participation in business ventures with potentially high but uncertain returns.',
            },
        ];
        await this.investmentCategoryRepository.save(categories);
    }
    async updateCategory(id, updateData, auditContext) {
        const oldCategory = await this.investmentCategoryRepository.findOne({
            where: { id },
        });
        if (!oldCategory) {
            throw new Error(`Investment category with ID ${id} not found`);
        }
        const oldValues = { ...oldCategory };
        await this.investmentCategoryRepository.update(id, updateData);
        const updatedCategory = await this.investmentCategoryRepository.findOne({
            where: { id },
        });
        if (!updatedCategory) {
            throw new Error(`Failed to retrieve updated category with ID ${id}`);
        }
        if (auditContext) {
            const changedFields = this.getChangedFields(oldValues, updatedCategory);
            await this.auditService.logUpdate('investment_category', id, auditContext, oldValues, updatedCategory, `Updated fields: ${changedFields.join(', ')}`);
        }
        return updatedCategory;
    }
    async deleteCategory(id, auditContext) {
        const category = await this.investmentCategoryRepository.findOne({
            where: { id },
        });
        if (!category) {
            throw new Error(`Investment category with ID ${id} not found`);
        }
        const oldValues = { ...category };
        await this.investmentCategoryRepository.remove(category);
        if (auditContext) {
            await this.auditService.logDelete('investment_category', id, auditContext, oldValues, `Deleted investment category: ${category.name}`);
        }
    }
    async getCategoryHistory(id) {
        return this.auditService.getEntityChangesSummary('investment_category', id);
    }
    getChangedFields(oldValues, newValues) {
        const changed = [];
        for (const key in newValues) {
            if (oldValues[key] !== newValues[key]) {
                changed.push(key);
            }
        }
        return changed;
    }
};
exports.InvestmentCategoryService = InvestmentCategoryService;
exports.InvestmentCategoryService = InvestmentCategoryService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(investment_category_entity_1.InvestmentCategory)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        audit_service_1.AuditService])
], InvestmentCategoryService);
//# sourceMappingURL=investment-category.service.js.map