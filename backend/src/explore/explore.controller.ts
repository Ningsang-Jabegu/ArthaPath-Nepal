import { Controller, Get, Query, ValidationPipe } from '@nestjs/common';
import { ExploreService } from './explore.service';
import { FilterExploreOpportunityDto } from './dto/filter-explore-opportunity.dto';
import { SortExploreOpportunityDto } from './dto/sort-explore-opportunity.dto';
import { InvestmentCategory } from '../entities/investment-category.entity';

@Controller('explore')
export class ExploreController {
  constructor(private readonly exploreService: ExploreService) {}

  /**
   * GET /explore/opportunities
   * Get all investment opportunities
   */
  @Get('opportunities')
  async getAllOpportunities(): Promise<InvestmentCategory[]> {
    return this.exploreService.findAll();
  }

  /**
   * GET /explore/opportunities/filter
   * Get filtered investment opportunities
   *
   * Query parameters:
   * - risk_level: 'Low' | 'Medium' | 'High'
   * - investment_type: 'Stocks' | 'Mutual Fund' | 'Bond' | 'FD' | 'Gold' | 'Real Estate' | 'Business'
   * - min_liquidity_score: 0-10
   * - lock_in_period: string
   * - max_minimum_capital: number (NPR)
   * - sort_by: see SortBy enum
   */
  @Get('opportunities/filter')
  async getFilteredOpportunities(
    @Query(new ValidationPipe({ transform: true }))
    filterDto: FilterExploreOpportunityDto,
    @Query(new ValidationPipe({ transform: true }))
    sortDto: SortExploreOpportunityDto,
  ): Promise<InvestmentCategory[]> {
    return this.exploreService.filterAndSort(filterDto, sortDto);
  }

  /**
   * GET /explore/lock-in-periods
   * Get all available lock-in periods
   */
  @Get('lock-in-periods')
  async getLockInPeriods(): Promise<string[]> {
    return this.exploreService.getLockInPeriods();
  }

  /**
   * GET /explore/statistics
   * Get statistics about investment opportunities
   */
  @Get('statistics')
  async getStatistics(): Promise<{
    total_opportunities: number;
    by_risk_level: Record<string, number>;
    by_type: Record<string, number>;
    avg_liquidity_score: number;
  }> {
    return this.exploreService.getStatistics();
  }
}
