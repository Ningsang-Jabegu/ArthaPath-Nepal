import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { SavedPlanService } from './saved-plan.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { SavePlanDto, UpdatePlanDto, SavedPlanResponseDto } from './saved-plan.dto';

@Controller('saved-plans')
@UseGuards(JwtAuthGuard)
export class SavedPlanController {
  constructor(private readonly savedPlanService: SavedPlanService) {}

  /**
   * Save a new investment plan
   * POST /saved-plans
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async savePlan(
    @CurrentUser() user: any,
    @Body() savePlanDto: SavePlanDto,
  ): Promise<SavedPlanResponseDto> {
    return this.savedPlanService.savePlan(user.userId, savePlanDto);
  }

  /**
   * Get all saved plans for the authenticated user
   * GET /saved-plans
   */
  @Get()
  async getUserPlans(@CurrentUser() user: any): Promise<SavedPlanResponseDto[]> {
    return this.savedPlanService.getUserPlans(user.userId);
  }

  /**
   * Get a specific saved plan by ID
   * GET /saved-plans/:id
   */
  @Get(':id')
  async getPlanById(
    @CurrentUser() user: any,
    @Param('id') planId: string,
  ): Promise<SavedPlanResponseDto> {
    return this.savedPlanService.getPlanById(user.userId, planId);
  }

  /**
   * Update plan metadata (name and description)
   * PATCH /saved-plans/:id
   */
  @Patch(':id')
  async updatePlan(
    @CurrentUser() user: any,
    @Param('id') planId: string,
    @Body() updatePlanDto: UpdatePlanDto,
  ): Promise<SavedPlanResponseDto> {
    return this.savedPlanService.updatePlan(user.userId, planId, updatePlanDto);
  }

  /**
   * Delete a saved plan
   * DELETE /saved-plans/:id
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deletePlan(@CurrentUser() user: any, @Param('id') planId: string): Promise<void> {
    return this.savedPlanService.deletePlan(user.userId, planId);
  }

  /**
   * Get count of saved plans for user
   * GET /saved-plans/count
   */
  @Get('stats/count')
  async getPlanCount(@CurrentUser() user: any): Promise<{ count: number }> {
    const count = await this.savedPlanService.getUserPlanCount(user.userId);
    return { count };
  }
}
