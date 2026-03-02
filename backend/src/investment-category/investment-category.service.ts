import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InvestmentCategory } from '../entities/investment-category.entity';
import { FilterInvestmentCategoryDto } from './dto/filter-investment-category.dto';

@Injectable()
export class InvestmentCategoryService implements OnModuleInit {
  constructor(
    @InjectRepository(InvestmentCategory)
    private readonly investmentCategoryRepository: Repository<InvestmentCategory>,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.seedCategoriesIfEmpty();
  }

  async findAll(): Promise<InvestmentCategory[]> {
    return this.investmentCategoryRepository.find({
      order: { name: 'ASC' },
    });
  }

  async filter(
    filterDto: FilterInvestmentCategoryDto,
  ): Promise<InvestmentCategory[]> {
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

  private async seedCategoriesIfEmpty(): Promise<void> {
    const categoriesCount = await this.investmentCategoryRepository.count();

    if (categoriesCount > 0) {
      return;
    }

    const categories: Array<Partial<InvestmentCategory>> = [
      {
        name: 'Stocks',
        type: 'Stocks',
        expected_return_min: 10,
        expected_return_max: 20,
        risk_level: 'High',
        liquidity_score: 8,
        lock_in_period: 'None',
        minimum_capital: 5000,
        description:
          'Equity investment in listed companies with high growth potential and higher volatility.',
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
        description:
          'Professionally managed pooled investments suitable for diversification and gradual wealth building.',
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
        description:
          'Fixed-income instruments offering relatively stable returns and lower risk than equities.',
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
        description:
          'Bank deposit product with guaranteed returns over a fixed tenure and minimal capital risk.',
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
        description:
          'Traditional inflation-hedging asset that provides portfolio stability during market uncertainty.',
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
        description:
          'Property-based investment with long-term appreciation potential but lower liquidity.',
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
        description:
          'Direct ownership or participation in business ventures with potentially high but uncertain returns.',
      },
    ];

    await this.investmentCategoryRepository.save(categories);
  }
}