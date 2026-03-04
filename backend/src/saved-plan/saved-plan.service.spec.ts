import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SavedPlanService } from './saved-plan.service';
import { SavedPlan } from '../entities/saved-plan.entity';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { SavePlanDto } from './saved-plan.dto';

describe('SavedPlanService', () => {
  let service: SavedPlanService;
  let repository: Repository<SavedPlan>;

  const mockUserId = 'user-123';
  const mockPlanId = 'plan-456';

  const mockSavePlanDto: SavePlanDto = {
    plan_name: 'My Retirement Plan',
    description: 'Long-term retirement savings',
    initial_capital: 100000,
    monthly_contribution: 5000,
    duration_years: 10,
    risk_tolerance: 'Medium',
    liquidity_need: 'Low',
    has_emergency_fund: true,
    risk_profile: 'BALANCED',
    allocation: { stocks: 40, bonds: 30, gold: 20, fd: 10 },
    capital_distribution: { stocks: 40000, bonds: 30000, gold: 20000, fd: 10000 },
    projection: {
      conservative: 150000,
      expected: 200000,
      optimistic: 250000,
      total_contributions: 120000,
    },
  };

  const mockSavedPlan: SavedPlan = {
    id: mockPlanId,
    user_id: mockUserId,
    plan_name: mockSavePlanDto.plan_name,
    description: mockSavePlanDto.description || null,
    initial_capital: mockSavePlanDto.initial_capital,
    monthly_contribution: mockSavePlanDto.monthly_contribution,
    duration_years: mockSavePlanDto.duration_years,
    risk_tolerance: mockSavePlanDto.risk_tolerance,
    liquidity_need: mockSavePlanDto.liquidity_need,
    has_emergency_fund: mockSavePlanDto.has_emergency_fund,
    risk_profile: mockSavePlanDto.risk_profile,
    allocation: mockSavePlanDto.allocation,
    capital_distribution: mockSavePlanDto.capital_distribution,
    projection: mockSavePlanDto.projection,
    created_at: new Date('2026-01-01'),
    updated_at: new Date('2026-01-01'),
    user: undefined as any,
  };

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
    count: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SavedPlanService,
        {
          provide: getRepositoryToken(SavedPlan),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<SavedPlanService>(SavedPlanService);
    repository = module.get<Repository<SavedPlan>>(getRepositoryToken(SavedPlan));

    // Reset mocks before each test
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('savePlan', () => {
    it('should save a new plan successfully', async () => {
      mockRepository.create.mockReturnValue(mockSavedPlan);
      mockRepository.save.mockResolvedValue(mockSavedPlan);

      const result = await service.savePlan(mockUserId, mockSavePlanDto);

      expect(mockRepository.create).toHaveBeenCalledWith({
        user_id: mockUserId,
        ...mockSavePlanDto,
      });
      expect(mockRepository.save).toHaveBeenCalledWith(mockSavedPlan);
      expect(result).toEqual({
        id: mockPlanId,
        user_id: mockUserId,
        plan_name: mockSavePlanDto.plan_name,
        description: mockSavePlanDto.description,
        initial_capital: mockSavePlanDto.initial_capital,
        monthly_contribution: mockSavePlanDto.monthly_contribution,
        duration_years: mockSavePlanDto.duration_years,
        risk_tolerance: mockSavePlanDto.risk_tolerance,
        liquidity_need: mockSavePlanDto.liquidity_need,
        has_emergency_fund: mockSavePlanDto.has_emergency_fund,
        risk_profile: mockSavePlanDto.risk_profile,
        allocation: mockSavePlanDto.allocation,
        capital_distribution: mockSavePlanDto.capital_distribution,
        projection: mockSavePlanDto.projection,
        created_at: mockSavedPlan.created_at,
        updated_at: mockSavedPlan.updated_at,
      });
    });
  });

  describe('getUserPlans', () => {
    it('should return all plans for a user', async () => {
      const mockPlans = [mockSavedPlan];
      mockRepository.find.mockResolvedValue(mockPlans);

      const result = await service.getUserPlans(mockUserId);

      expect(mockRepository.find).toHaveBeenCalledWith({
        where: { user_id: mockUserId },
        order: { created_at: 'DESC' },
      });
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(mockPlanId);
    });

    it('should return empty array if user has no plans', async () => {
      mockRepository.find.mockResolvedValue([]);

      const result = await service.getUserPlans(mockUserId);

      expect(result).toEqual([]);
    });
  });

  describe('getPlanById', () => {
    it('should return a plan if it exists and belongs to user', async () => {
      mockRepository.findOne.mockResolvedValue(mockSavedPlan);

      const result = await service.getPlanById(mockUserId, mockPlanId);

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: mockPlanId },
      });
      expect(result.id).toBe(mockPlanId);
    });

    it('should throw NotFoundException if plan does not exist', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.getPlanById(mockUserId, 'nonexistent-id')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw ForbiddenException if plan belongs to different user', async () => {
      const otherUserPlan = { ...mockSavedPlan, user_id: 'other-user-id' };
      mockRepository.findOne.mockResolvedValue(otherUserPlan);

      await expect(service.getPlanById(mockUserId, mockPlanId)).rejects.toThrow(
        ForbiddenException,
      );
    });
  });

  describe('updatePlan', () => {
    it('should update plan name and description', async () => {
      const updateDto = { plan_name: 'Updated Plan Name', description: 'Updated description' };
      mockRepository.findOne.mockResolvedValue(mockSavedPlan);
      mockRepository.save.mockResolvedValue({ ...mockSavedPlan, ...updateDto });

      const result = await service.updatePlan(mockUserId, mockPlanId, updateDto);

      expect(result.plan_name).toBe(updateDto.plan_name);
      expect(result.description).toBe(updateDto.description);
    });

    it('should throw NotFoundException if plan does not exist', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(
        service.updatePlan(mockUserId, 'nonexistent-id', { plan_name: 'New Name' }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException if plan belongs to different user', async () => {
      const otherUserPlan = { ...mockSavedPlan, user_id: 'other-user-id' };
      mockRepository.findOne.mockResolvedValue(otherUserPlan);

      await expect(
        service.updatePlan(mockUserId, mockPlanId, { plan_name: 'New Name' }),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('deletePlan', () => {
    it('should delete a plan if it exists and belongs to user', async () => {
      mockRepository.findOne.mockResolvedValue(mockSavedPlan);
      mockRepository.remove.mockResolvedValue(mockSavedPlan);

      await service.deletePlan(mockUserId, mockPlanId);

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: mockPlanId },
      });
      expect(mockRepository.remove).toHaveBeenCalledWith(mockSavedPlan);
    });

    it('should throw NotFoundException if plan does not exist', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.deletePlan(mockUserId, 'nonexistent-id')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw ForbiddenException if plan belongs to different user', async () => {
      const otherUserPlan = { ...mockSavedPlan, user_id: 'other-user-id' };
      mockRepository.findOne.mockResolvedValue(otherUserPlan);

      await expect(service.deletePlan(mockUserId, mockPlanId)).rejects.toThrow(
        ForbiddenException,
      );
    });
  });

  describe('getUserPlanCount', () => {
    it('should return count of user plans', async () => {
      mockRepository.count.mockResolvedValue(5);

      const result = await service.getUserPlanCount(mockUserId);

      expect(mockRepository.count).toHaveBeenCalledWith({
        where: { user_id: mockUserId },
      });
      expect(result).toBe(5);
    });

    it('should return 0 if user has no plans', async () => {
      mockRepository.count.mockResolvedValue(0);

      const result = await service.getUserPlanCount(mockUserId);

      expect(result).toBe(0);
    });
  });
});
