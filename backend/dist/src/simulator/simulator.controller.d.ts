import { SimulatorService } from './simulator.service';
import { UserInputDto } from './dto/user-input.dto';
export declare class SimulatorController {
    private readonly simulatorService;
    constructor(simulatorService: SimulatorService);
    runSimulation(userInput: UserInputDto): Promise<import("./simulator.service").SimulationResult>;
}
