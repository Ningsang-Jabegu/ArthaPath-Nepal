import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SimulatorController } from './simulator.controller';
import { SimulatorService } from './simulator.service';
import { SimulationHistory } from '../entities/simulation-history.entity';
import { RiskEngineService } from '../risk-engine/risk-engine.service';
import { AllocationEngineService } from '../allocation-engine/allocation-engine.service';
import { ProjectionEngineService } from '../projection-engine/projection-engine.service';

@Module({
  imports: [TypeOrmModule.forFeature([SimulationHistory])],
  controllers: [SimulatorController],
  providers: [
    SimulatorService,
    RiskEngineService,
    AllocationEngineService,
    ProjectionEngineService,
  ],
})
export class SimulatorModule {}
