import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SavedPlan } from '../entities/saved-plan.entity';
import { SavedPlanController } from './saved-plan.controller';
import { SavedPlanService } from './saved-plan.service';

@Module({
  imports: [TypeOrmModule.forFeature([SavedPlan])],
  controllers: [SavedPlanController],
  providers: [SavedPlanService],
  exports: [SavedPlanService],
})
export class SavedPlanModule {}
