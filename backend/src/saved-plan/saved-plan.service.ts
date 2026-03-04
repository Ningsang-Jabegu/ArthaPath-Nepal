import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SavedPlan } from '../entities/saved-plan.entity';
import { SavePlanDto, UpdatePlanDto, SavedPlanResponseDto } from './saved-plan.dto';

@Injectable()
export class SavedPlanService {
  constructor(
    @InjectRepository(SavedPlan)
    private savedPlanRepository: Repository<SavedPlan>,
  ) {}

  /**
   * Save a new plan for a user
   */
  async savePlan(userId: string, savePlanDto: SavePlanDto): Promise<SavedPlanResponseDto> {
    const savedPlan = this.savedPlanRepository.create({
      user_id: userId,
      ...savePlanDto,
    });

    const result = await this.savedPlanRepository.save(savedPlan);
    return this.mapToResponseDto(result);
  }

  /**
   * Get all saved plans for a user
   */
  async getUserPlans(userId: string): Promise<SavedPlanResponseDto[]> {
    const plans = await this.savedPlanRepository.find({
      where: { user_id: userId },
      order: { created_at: 'DESC' },
    });

    return plans.map((plan) => this.mapToResponseDto(plan));
  }

  /**
   * Get a specific saved plan by ID
   */
  async getPlanById(userId: string, planId: string): Promise<SavedPlanResponseDto> {
    const plan = await this.savedPlanRepository.findOne({
      where: { id: planId },
    });

    if (!plan) {
      throw new NotFoundException(`Plan with ID ${planId} not found`);
    }

    // Ensure user owns this plan
    if (plan.user_id !== userId) {
      throw new ForbiddenException('You do not have access to this plan');
    }

    return this.mapToResponseDto(plan);
  }

  /**
   * Update plan metadata (name and description)
   */
  async updatePlan(
    userId: string,
    planId: string,
    updatePlanDto: UpdatePlanDto,
  ): Promise<SavedPlanResponseDto> {
    const plan = await this.savedPlanRepository.findOne({
      where: { id: planId },
    });

    if (!plan) {
      throw new NotFoundException(`Plan with ID ${planId} not found`);
    }

    // Ensure user owns this plan
    if (plan.user_id !== userId) {
      throw new ForbiddenException('You do not have access to this plan');
    }

    // Update only name and description
    if (updatePlanDto.plan_name) {
      plan.plan_name = updatePlanDto.plan_name;
    }
    if (updatePlanDto.description !== undefined) {
      plan.description = updatePlanDto.description;
    }

    const updated = await this.savedPlanRepository.save(plan);
    return this.mapToResponseDto(updated);
  }

  /**
   * Delete a saved plan
   */
  async deletePlan(userId: string, planId: string): Promise<void> {
    const plan = await this.savedPlanRepository.findOne({
      where: { id: planId },
    });

    if (!plan) {
      throw new NotFoundException(`Plan with ID ${planId} not found`);
    }

    // Ensure user owns this plan
    if (plan.user_id !== userId) {
      throw new ForbiddenException('You do not have access to this plan');
    }

    await this.savedPlanRepository.remove(plan);
  }

  /**
   * Get count of saved plans for a user
   */
  async getUserPlanCount(userId: string): Promise<number> {
    return this.savedPlanRepository.count({
      where: { user_id: userId },
    });
  }

  /**
   * Map entity to response DTO
   */
  private mapToResponseDto(plan: SavedPlan): SavedPlanResponseDto {
    return {
      id: plan.id,
      user_id: plan.user_id,
      plan_name: plan.plan_name,
      description: plan.description,
      initial_capital: plan.initial_capital,
      monthly_contribution: plan.monthly_contribution,
      duration_years: plan.duration_years,
      risk_tolerance: plan.risk_tolerance,
      liquidity_need: plan.liquidity_need,
      has_emergency_fund: plan.has_emergency_fund,
      risk_profile: plan.risk_profile,
      allocation: plan.allocation,
      capital_distribution: plan.capital_distribution,
      projection: plan.projection,
      created_at: plan.created_at,
      updated_at: plan.updated_at,
    };
  }
}
