import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ExploreService } from './explore.service';
import { InvestmentCategory } from '../entities/investment-category.entity';
import { SortBy } from './dto/sort-explore-opportunity.dto';
import { RiskLevelFilter, InvestmentTypeFilter } from './dto/filter-explore-opportunity.dto';

describe('ExploreService', () => {
  let service: ExploreService;
  let repository: Repository<InvestmentCategory>;

  const mockOpportunities: InvestmentCategory[] = [
    {
      id: '1',
      name: 'Stocks',
      type: 'Stocks',
      expected_return_min: 8,
      expected_return_max: 15,
      risk_level: 'High',
      liquidity_score: 9,
      lock_in_period: 'None',
      minimum_capital: 1000,
      description: 'Stock investments',
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      id: '2',
      name: 'Fixed Deposit',
      type: 'FD',
      expected_return_min: 4,
      expected_return_max: 7,
      risk_level: 'Low',
      liquidity_score: 3,
      lock_in_period: '1 year',
      minimum_capital: 5000,
      description: 'Bank FD',
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      id: '3',
      name: 'Mutual Fund',
      type: 'Mutual Fund',
      expected_return_min: 7,
      expected_return_max: 12,
      risk_level: 'Medium',
      liquidity_score: 8,
      lock_in_period: 'None',
      minimum_capital: 2000,
      description: 'Equity Mutual Fund',
      created_at: new Date(),
      updated_at: new Date(),
    },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExploreService,
        {
          provide: getRepositoryToken(InvestmentCategory),
          useValue: {
            find: jest.fn(),
            createQueryBuilder: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ExploreService>(ExploreService);
    repository = module.get<Repository<InvestmentCategory>>(
      getRepositoryToken(InvestmentCategory),
    );
  });

  describe('findAll', () => {
    it('should return all opportunities sorted by name', async () => {
      jest
        .spyOn(repository, 'find')
        .mockResolvedValue(mockOpportunities);

      const result = await service.findAll();

      expect(result).toEqual(mockOpportunities);
      expect(repository.find).toHaveBeenCalledWith({
        order: { name: 'ASC' },
      });
    });
  });

  describe('filter', () => {
    it('should filter by risk level', async () => {
      const mockQuery = {
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([mockOpportunities[0]]),
      };

      jest
        .spyOn(repository, 'createQueryBuilder')
        .mockReturnValue(mockQuery as any);

      const result = await service.filter({ risk_level: RiskLevelFilter.HIGH });

      expect(result).toEqual([mockOpportunities[0]]);
      expect(mockQuery.andWhere).toHaveBeenCalled();
    });

    it('should filter by investment type', async () => {
      const mockQuery = {
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([mockOpportunities[1]]),
      };

      jest
        .spyOn(repository, 'createQueryBuilder')
        .mockReturnValue(mockQuery as any);

      const result = await service.filter({ investment_type: InvestmentTypeFilter.FD });

      expect(result).toEqual([mockOpportunities[1]]);
    });

    it('should filter by minimum liquidity score', async () => {
      const mockQuery = {
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([mockOpportunities[0], mockOpportunities[2]]),
      };

      jest
        .spyOn(repository, 'createQueryBuilder')
        .mockReturnValue(mockQuery as any);

      const result = await service.filter({ min_liquidity_score: 8 });

      expect(result).toEqual([
        mockOpportunities[0],
        mockOpportunities[2],
      ]);
    });

    it('should filter by maximum minimum capital', async () => {
      const mockQuery = {
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([
          mockOpportunities[0],
          mockOpportunities[2],
        ]),
      };

      jest
        .spyOn(repository, 'createQueryBuilder')
        .mockReturnValue(mockQuery as any);

      const result = await service.filter({ max_minimum_capital: 2000 });

      expect(result).toEqual([
        mockOpportunities[0],
        mockOpportunities[2],
      ]);
    });
  });

  describe('filterAndSort', () => {
    it('should sort by risk ascending', async () => {
      const mockQuery = {
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(mockOpportunities),
      };

      jest
        .spyOn(repository, 'createQueryBuilder')
        .mockReturnValue(mockQuery as any);

      const result = await service.filterAndSort(
        {},
        { sort_by: SortBy.RISK_ASC },
      );

      // Low < Medium < High
      expect(result[0].risk_level).toBe('Low');
      expect(result[1].risk_level).toBe('Medium');
      expect(result[2].risk_level).toBe('High');
    });

    it('should sort by return descending', async () => {
      const mockQuery = {
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(mockOpportunities),
      };

      jest
        .spyOn(repository, 'createQueryBuilder')
        .mockReturnValue(mockQuery as any);

      const result = await service.filterAndSort(
        {},
        { sort_by: SortBy.RETURN_DESC },
      );

      // Should be sorted by expected_return_max descending
      expect(result[0].expected_return_max).toBeGreaterThanOrEqual(
        result[1].expected_return_max,
      );
    });

    it('should sort by liquidity descending', async () => {
      const mockQuery = {
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(mockOpportunities),
      };

      jest
        .spyOn(repository, 'createQueryBuilder')
        .mockReturnValue(mockQuery as any);

      const result = await service.filterAndSort(
        {},
        { sort_by: SortBy.LIQUIDITY_DESC },
      );

      // Should be sorted by liquidity_score descending
      expect(result[0].liquidity_score).toBeGreaterThanOrEqual(
        result[1].liquidity_score,
      );
    });
  });

  describe('getLockInPeriods', () => {
    it('should return unique lock-in periods', async () => {
      const mockQuery = {
        select: jest.fn().mockReturnThis(),
        getRawMany: jest
          .fn()
          .mockResolvedValue([
            { lockInPeriod: 'None' },
            { lockInPeriod: '1 year' },
          ]),
      };

      jest
        .spyOn(repository, 'createQueryBuilder')
        .mockReturnValue(mockQuery as any);

      const result = await service.getLockInPeriods();

      expect(result).toEqual(['1 year', 'None']);
      expect(result.length).toBe(2);
    });
  });

  describe('getStatistics', () => {
    it('should return opportunity statistics', async () => {
      jest
        .spyOn(repository, 'find')
        .mockResolvedValue(mockOpportunities);

      const result = await service.getStatistics();

      expect(result.total_opportunities).toBe(3);
      expect(result.by_risk_level['Low']).toBe(1);
      expect(result.by_risk_level['Medium']).toBe(1);
      expect(result.by_risk_level['High']).toBe(1);
      expect(result.by_type['Stocks']).toBe(1);
      expect(result.by_type['FD']).toBe(1);
      expect(result.by_type['Mutual Fund']).toBe(1);
      expect(result.avg_liquidity_score).toBeCloseTo(
        (9 + 3 + 8) / 3,
        1,
      );
    });

    it('should handle empty opportunities', async () => {
      jest.spyOn(repository, 'find').mockResolvedValue([]);

      const result = await service.getStatistics();

      expect(result.total_opportunities).toBe(0);
      expect(result.avg_liquidity_score).toBe(0);
    });
  });
});
