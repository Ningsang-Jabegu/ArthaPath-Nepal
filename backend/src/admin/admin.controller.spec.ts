import { Test, TestingModule } from '@nestjs/testing';
import { AdminController } from './admin.controller';
import { AdminService, UsageAnalytics } from './admin.service';
import { InvestmentCategory } from '../entities/investment-category.entity';
import {
  CreateInvestmentCategoryDto,
  InvestmentType,
  RiskLevel,
} from './dto/create-investment-category.dto';
import { UpdateInvestmentCategoryDto } from './dto/update-investment-category.dto';
import { UserRole } from '../entities/user.entity';

describe('AdminController', () => {
  let controller: AdminController;
  let service: AdminService;

  const mockCategory: InvestmentCategory = {
    id: '1',
    name: 'Test Stock',
    type: 'Stocks',
    expected_return_min: 8,
    expected_return_max: 15,
    risk_level: 'High',
    liquidity_score: 9,
    lock_in_period: 'None',
    minimum_capital: 1000,
    description: 'Test stock description',
    created_at: new Date(),
    updated_at: new Date(),
  };

  const mockAnalytics: UsageAnalytics = {
    totalUsers: 100,
    totalInvestmentCategories: 7,
    usersByRole: {
      admin: 5,
      user: 95,
    },
    categoriesByRiskLevel: {
      Low: 2,
      Medium: 3,
      High: 2,
    },
    categoriesByType: {
      Stocks: 2,
      Bond: 1,
      FD: 1,
    },
    recentUsers: [
      {
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
        created_at: new Date(),
      },
    ],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminController],
      providers: [
        {
          provide: AdminService,
          useValue: {
            createCategory: jest.fn(),
            getAllCategories: jest.fn(),
            getCategoryById: jest.fn(),
            updateCategory: jest.fn(),
            deleteCategory: jest.fn(),
            getUsageAnalytics: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AdminController>(AdminController);
    service = module.get<AdminService>(AdminService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createCategory', () => {
    it('should create a new investment category', async () => {
      const dto: CreateInvestmentCategoryDto = {
        name: 'Test Stock',
        type: InvestmentType.STOCKS,
        expected_return_min: 8,
        expected_return_max: 15,
        risk_level: RiskLevel.HIGH,
        liquidity_score: 9,
        lock_in_period: 'None',
        minimum_capital: 1000,
        description: 'Test stock description',
      };

      jest.spyOn(service, 'createCategory').mockResolvedValue(mockCategory);

      const result = await controller.createCategory(dto);

      expect(service.createCategory).toHaveBeenCalledWith(dto);
      expect(result).toEqual(mockCategory);
    });
  });

  describe('getAllCategories', () => {
    it('should return all investment categories', async () => {
      const categories = [mockCategory];
      jest.spyOn(service, 'getAllCategories').mockResolvedValue(categories);

      const result = await controller.getAllCategories();

      expect(service.getAllCategories).toHaveBeenCalled();
      expect(result).toEqual(categories);
    });
  });

  describe('getCategoryById', () => {
    it('should return a category by id', async () => {
      jest.spyOn(service, 'getCategoryById').mockResolvedValue(mockCategory);

      const result = await controller.getCategoryById('1');

      expect(service.getCategoryById).toHaveBeenCalledWith('1');
      expect(result).toEqual(mockCategory);
    });
  });

  describe('updateCategory', () => {
    it('should update an existing category', async () => {
      const dto: UpdateInvestmentCategoryDto = {
        name: 'Updated Stock',
      };

      const updatedCategory = { ...mockCategory, ...dto };

      jest.spyOn(service, 'updateCategory').mockResolvedValue(updatedCategory);

      const result = await controller.updateCategory('1', dto);

      expect(service.updateCategory).toHaveBeenCalledWith('1', dto);
      expect(result.name).toBe('Updated Stock');
    });
  });

  describe('deleteCategory', () => {
    it('should delete a category', async () => {
      jest.spyOn(service, 'deleteCategory').mockResolvedValue(undefined);

      const result = await controller.deleteCategory('1');

      expect(service.deleteCategory).toHaveBeenCalledWith('1');
      expect(result).toEqual({
        message: 'Investment category deleted successfully',
      });
    });
  });

  describe('getUsageAnalytics', () => {
    it('should return usage analytics', async () => {
      jest.spyOn(service, 'getUsageAnalytics').mockResolvedValue(mockAnalytics);

      const result = await controller.getUsageAnalytics();

      expect(service.getUsageAnalytics).toHaveBeenCalled();
      expect(result).toEqual(mockAnalytics);
      expect(result.totalUsers).toBe(100);
      expect(result.totalInvestmentCategories).toBe(7);
      expect(result.usersByRole.admin).toBe(5);
    });
  });
});
