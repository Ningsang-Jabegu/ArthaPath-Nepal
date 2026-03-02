import { Repository } from 'typeorm';
import { UserInputDto } from './dto/user-input.dto';
import { SimulationHistory } from '../entities/simulation-history.entity';
import { RiskEngineService, RiskProfile } from '../risk-engine/risk-engine.service';
import { AllocationEngineService, AllocationResult } from '../allocation-engine/allocation-engine.service';
import { ProjectionEngineService, ProjectionResult } from '../projection-engine/projection-engine.service';
export interface SimulationResult {
    risk_profile: RiskProfile;
    allocation: AllocationResult;
    capital_distribution: Record<string, number>;
    projection: ProjectionResult;
    yearly_projection: Array<{
        year: number;
        conservative: number;
        expected: number;
        optimistic: number;
    }>;
}
export declare class SimulatorService {
    private simulationHistoryRepository;
    private riskEngineService;
    private allocationEngineService;
    private projectionEngineService;
    constructor(simulationHistoryRepository: Repository<SimulationHistory>, riskEngineService: RiskEngineService, allocationEngineService: AllocationEngineService, projectionEngineService: ProjectionEngineService);
    runSimulation(userInput: UserInputDto, userId?: string): Promise<SimulationResult>;
    private saveToHistory;
    getUserHistory(userId: string): Promise<SimulationHistory[]>;
}
