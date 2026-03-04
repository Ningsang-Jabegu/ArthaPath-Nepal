import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { AdminService } from './admin.service';
import { InvestmentCategory } from '../entities/investment-category.entity';
import { User, UserRole } from '../entities/user.entity';
import {
  CreateInvestmentCategoryDto,
  InvestmentType,
  RiskLevel,
} from './dto/create-investment-category.dto';
import { UpdateInvestmentCategoryDto } from './dto/update-investment-category.dto';

describe('AdminService', () => {
  let service: AdminService;
  let categoryRepository: Repository<InvestmentCategory>;
  let userRepository: Repository<User>;

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

  const mockUser: User = {
    id: '1',
    email: 'test@example.com',
    password: 'hashed',
    name: 'Test User',
    role: UserRole.USER,
    created_at: new Date(),
    updated_at: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdminService,
        {
          provide: getRepositoryToken(InvestmentCategory),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
            remove: jest.fn(),
            count: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(User),
          useValue: {
            count: jest.fn(),
            find: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AdminService>(AdminService);
    categoryRepository = module.get<Repository<InvestmentCategory>>(
      getRepositoryToken(InvestmentCategory),
    );
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
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

      jest.spyOn(categoryRepository, 'create').mockReturnValue(mockCategory);
      jest.spyOn(categoryRepository, 'save').mockResolvedValue(mockCategory);

      const result = await service.createCategory(dto);

      expect(categoryRepository.create).toHaveBeenCalledWith(dto);
      expect(categoryRepository.save).toHaveBeenCalledWith(mockCategory);
      expect(result).toEqual(mockCategory);
    });
  });

  describe('getAllCategories', () => {
    it('should return all investment categories sorted by name', async () => {
      const categories = [mockCategory];
      jest.spyOn(categoryRepository, 'find').mockResolvedValue(categories);

      const result = await service.getAllCategories();

      expect(categoryRepository.find).toHaveBeenCalledWith({
        order: { name: 'ASC' },
      });
      expect(result).toEqual(categories);
    });
  });

  describe('getCategoryById', () => {
    it('should return a category by id', async () => {
      jest
        .spyOn(categoryRepository, 'findOne')
        .mockResolvedValue(mockCategory);

      const result = await service.getCategoryById('1');

      expect(categoryRepository.findOne).toHaveBeenCalledWith({
        where: { id: '1' },
      });
      expect(result).toEqual(mockCategory);
    });

    it('should throw NotFoundException if category not found', async () => {
      jest.spyOn(categoryRepository, 'findOne').mockResolvedValue(null);

      await expect(service.getCategoryById('999')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('updateCategory', () => {
    it('should update an existing category', async () => {
      const dto: UpdateInvestmentCategoryDto = {
        name: 'Updated Stock',
        expected_return_min: 10,
      };

      const updatedCategory = { ...mockCategory, ...dto };

      jest
        .spyOn(categoryRepository, 'findOne')
        .mockResolvedValue(mockCategory);
      jest
        .spyOn(categoryRepository, 'save')
        .mockResolvedValue(updatedCategory);

      const result = await service.updateCategory('1', dto);

      expect(categoryRepository.findOne).toHaveBeenCalledWith({
        where: { id: '1' },
      });
      expect(categoryRepository.save).toHaveBeenCalled();
      expect(result.name).toBe('Updated Stock');
      expect(result.expected_return_min).toBe(10);
    });

    it('should throw NotFoundException if category not found', async () => {
      jest.spyOn(categoryRepository, 'findOne').mockResolvedValue(null);

      await expect(
        service.updateCategory('999', { name: 'Updated' }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('deleteCategory', () => {
    it('should delete a category', async () => {
      jest
        .spyOn(categoryRepository, 'findOne')
        .mockResolvedValue(mockCategory);
      jest.spyOn(categoryRepository, 'remove').mockResolvedValue(mockCategory);

      await service.deleteCategory('1');

      expect(categoryRepository.findOne).toHaveBeenCalledWith({
        where: { id: '1' },
      });
      expect(categoryRepository.remove).toHaveBeenCalledWith(mockCategory);
    });

    it('should throw NotFoundException if category not found', async () => {
      jest.spyOn(categoryRepository, 'findOne').mockResolvedValue(null);

      await expect(service.deleteCategory('999')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('getUsageAnalytics', () => {
    it('should return comprehensive usage analytics', async () => {
      const categories = [
        { ...mockCategory, risk_level: 'Low' as const, type: 'Stocks' as const },
        { ...mockCategory, id: '2', risk_level: 'Medium' as const, type: 'Bond' as const },
        { ...mockCategory, id: '3', risk_level: 'High' as const, type: 'Stocks' as const },
      ];

      jest.spyOn(userRepository, 'count')
        .mockResolvedValueOnce(100) // totalUsers
        .mockResolvedValueOnce(5); // adminCount

      jest.spyOn(categoryRepository, 'count')
        .mockResolvedValueOnce(7) // totalInvestmentCategories
        .mockResolvedValueOnce(2) // lowRiskCount
        .mockResolvedValueOnce(3) // mediumRiskCount
        .mockResolvedValueOnce(2); // highRiskCount

      jest.spyOn(categoryRepository, 'find')
        .mockResolvedValueOnce(categories) // for categoriesByType
        .mockResolvedValueOnce([]); // not called in this case

      jest.spyOn(userRepository, 'find').mockResolvedValue([mockUser]);

      const result = await service.getUsageAnalytics();

      expect(result.totalUsers).toBe(100);
      expect(result.totalInvestmentCategories).toBe(7);
      expect(result.usersByRole.admin).toBe(5);
      expect(result.usersByRole.user).toBe(95);
      expect(result.categoriesByRiskLevel.Low).toBe(2);
      expect(result.categoriesByRiskLevel.Medium).toBe(3);
      expect(result.categoriesByRiskLevel.High).toBe(2);
      expect(result.categoriesByType).toBeDefined();
      expect(result.recentUsers).toHaveLength(1);
    });

    it('should handle empty database', async () => {
      jest.spyOn(userRepository, 'count')
        .mockResolvedValueOnce(0) // totalUsers
        .mockResolvedValueOnce(0); // adminCount

      jest.spyOn(categoryRepository, 'count')
        .mockResolvedValueOnce(0) // totalInvestmentCategories
        .mockResolvedValueOnce(0) // lowRiskCount
        .mockResolvedValueOnce(0) // mediumRiskCount
        .mockResolvedValueOnce(0); // highRiskCount

      jest.spyOn(categoryRepository, 'find').mockResolvedValue([]);
      jest.spyOn(userRepository, 'find').mockResolvedValue([]);

      const result = await service.getUsageAnalytics();

      expect(result.totalUsers).toBe(0);
      expect(result.totalInvestmentCategories).toBe(0);
      expect(result.usersByRole.admin).toBe(0);
      expect(result.usersByRole.user).toBe(0);
      expect(result.recentUsers).toHaveLength(0);
    });
  });
});
