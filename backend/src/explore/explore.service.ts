import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InvestmentCategory } from '../entities/investment-category.entity';
import { FilterExploreOpportunityDto } from './dto/filter-explore-opportunity.dto';
import { SortExploreOpportunityDto, SortBy } from './dto/sort-explore-opportunity.dto';

const riskLevelOrder: Record<string, number> = {
  Low: 1,
  Medium: 2,
  High: 3,
};

@Injectable()
export class ExploreService {
  constructor(
    @InjectRepository(InvestmentCategory)
    private readonly opportunityRepository: Repository<InvestmentCategory>,
  ) {}

  /**
   * Get all investment opportunities
   */
  async findAll(): Promise<InvestmentCategory[]> {
    return this.opportunityRepository.find({
      order: { name: 'ASC' },
    });
  }

  /**
   * Filter opportunities by various criteria
   */
  async filter(
    filterDto: FilterExploreOpportunityDto,
  ): Promise<InvestmentCategory[]> {
    const query =
      this.opportunityRepository.createQueryBuilder('opportunity');

    // Filter by risk level
    if (filterDto.risk_level) {
      query.andWhere('opportunity.risk_level = :risk_level', {
        risk_level: filterDto.risk_level,
      });
    }

    // Filter by investment type
    if (filterDto.investment_type) {
      query.andWhere('opportunity.type = :type', {
        type: filterDto.investment_type,
      });
    }

    // Filter by minimum liquidity score
    if (filterDto.min_liquidity_score !== undefined) {
      query.andWhere('opportunity.liquidity_score >= :min_liquidity', {
        min_liquidity: filterDto.min_liquidity_score,
      });
    }

    // Filter by lock-in period (exact match)
    if (filterDto.lock_in_period) {
      query.andWhere('opportunity.lock_in_period = :lock_in', {
        lock_in: filterDto.lock_in_period,
      });
    }

    // Filter by maximum minimum capital
    if (filterDto.max_minimum_capital !== undefined) {
      query.andWhere('opportunity.minimum_capital <= :max_capital', {
        max_capital: filterDto.max_minimum_capital,
      });
    }

    return query.orderBy('opportunity.name', 'ASC').getMany();
  }

  /**
   * Get opportunities sorted by specified criteria
   */
  async filterAndSort(
    filterDto: FilterExploreOpportunityDto,
    sortDto: SortExploreOpportunityDto,
  ): Promise<InvestmentCategory[]> {
    // First apply filters
    let opportunities = await this.filter(filterDto);

    // Then apply sorting
    const sortBy = sortDto.sort_by || SortBy.RISK_ASC;

    switch (sortBy) {
      case SortBy.RISK_ASC:
        opportunities.sort(
          (a, b) =>
            riskLevelOrder[a.risk_level] - riskLevelOrder[b.risk_level],
        );
        break;

      case SortBy.RISK_DESC:
        opportunities.sort(
          (a, b) =>
            riskLevelOrder[b.risk_level] - riskLevelOrder[a.risk_level],
        );
        break;

      case SortBy.RETURN_ASC:
        opportunities.sort((a, b) => a.expected_return_min - b.expected_return_min);
        break;

      case SortBy.RETURN_DESC:
        opportunities.sort((a, b) => b.expected_return_max - a.expected_return_max);
        break;

      case SortBy.LIQUIDITY_ASC:
        opportunities.sort((a, b) => a.liquidity_score - b.liquidity_score);
        break;

      case SortBy.LIQUIDITY_DESC:
        opportunities.sort((a, b) => b.liquidity_score - a.liquidity_score);
        break;

      case SortBy.NAME_ASC:
        opportunities.sort((a, b) => a.name.localeCompare(b.name));
        break;

      case SortBy.NAME_DESC:
        opportunities.sort((a, b) => b.name.localeCompare(a.name));
        break;

      default:
        // Default: sort by risk ascending
        opportunities.sort(
          (a, b) =>
            riskLevelOrder[a.risk_level] - riskLevelOrder[b.risk_level],
        );
    }

    return opportunities;
  }

  /**
   * Get unique lock-in periods available
   */
  async getLockInPeriods(): Promise<string[]> {
    const results = await this.opportunityRepository
      .createQueryBuilder('opportunity')
      .select('DISTINCT opportunity.lock_in_period', 'lockInPeriod')
      .getRawMany();

    return results.map((r) => r.lockInPeriod).sort();
  }

  /**
   * Get investment opportunity statistics
   */
  async getStatistics(): Promise<{
    total_opportunities: number;
    by_risk_level: Record<string, number>;
    by_type: Record<string, number>;
    avg_liquidity_score: number;
  }> {
    const opportunities = await this.findAll();

    const by_risk_level: Record<string, number> = {
      Low: 0,
      Medium: 0,
      High: 0,
    };

    const by_type: Record<string, number> = {};
    let total_liquidity = 0;

    opportunities.forEach((opp) => {
      by_risk_level[opp.risk_level] += 1;
      by_type[opp.type] = (by_type[opp.type] || 0) + 1;
      total_liquidity += opp.liquidity_score;
    });

    return {
      total_opportunities: opportunities.length,
      by_risk_level,
      by_type,
      avg_liquidity_score:
        opportunities.length > 0
          ? total_liquidity / opportunities.length
          : 0,
    };
  }
}
