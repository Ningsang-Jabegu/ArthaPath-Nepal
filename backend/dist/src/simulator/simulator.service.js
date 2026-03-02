"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SimulatorService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const simulation_history_entity_1 = require("../entities/simulation-history.entity");
const risk_engine_service_1 = require("../risk-engine/risk-engine.service");
const allocation_engine_service_1 = require("../allocation-engine/allocation-engine.service");
const projection_engine_service_1 = require("../projection-engine/projection-engine.service");
let SimulatorService = class SimulatorService {
    simulationHistoryRepository;
    riskEngineService;
    allocationEngineService;
    projectionEngineService;
    constructor(simulationHistoryRepository, riskEngineService, allocationEngineService, projectionEngineService) {
        this.simulationHistoryRepository = simulationHistoryRepository;
        this.riskEngineService = riskEngineService;
        this.allocationEngineService = allocationEngineService;
        this.projectionEngineService = projectionEngineService;
    }
    async runSimulation(userInput, userId) {
        const riskProfile = this.riskEngineService.calculateRiskProfile(userInput.duration_years, userInput.liquidity_need, userInput.risk_tolerance, userInput.has_emergency_fund);
        const allocation = this.allocationEngineService.generateAllocation(riskProfile, userInput.duration_years, userInput.initial_capital);
        const capitalDistribution = this.allocationEngineService.calculateCapitalDistribution(allocation, userInput.initial_capital);
        const projection = this.projectionEngineService.calculateProjection(userInput.initial_capital, userInput.monthly_contribution, userInput.duration_years, riskProfile);
        const yearlyProjection = this.projectionEngineService.generateYearlyProjection(userInput.initial_capital, userInput.monthly_contribution, userInput.duration_years, riskProfile);
        if (userId) {
            await this.saveToHistory(userId, userInput, riskProfile, allocation, projection);
        }
        return {
            risk_profile: riskProfile,
            allocation,
            capital_distribution: capitalDistribution,
            projection,
            yearly_projection: yearlyProjection,
        };
    }
    async saveToHistory(userId, userInput, riskProfile, allocation, projection) {
        const history = new simulation_history_entity_1.SimulationHistory();
        history.user_id = userId;
        history.initial_capital = userInput.initial_capital;
        history.monthly_contribution = userInput.monthly_contribution;
        history.duration_years = userInput.duration_years;
        history.risk_tolerance = userInput.risk_tolerance;
        history.liquidity_need = userInput.liquidity_need;
        history.has_emergency_fund = userInput.has_emergency_fund;
        history.risk_profile = riskProfile;
        history.allocation_result = allocation;
        history.projection_result = {
            conservative: projection.conservative,
            expected: projection.expected,
            optimistic: projection.optimistic,
            total_contributions: projection.total_contributions,
        };
        await this.simulationHistoryRepository.save(history);
    }
    async getUserHistory(userId) {
        return this.simulationHistoryRepository.find({
            where: { user_id: userId },
            order: { created_at: 'DESC' },
            take: 10,
        });
    }
};
exports.SimulatorService = SimulatorService;
exports.SimulatorService = SimulatorService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(simulation_history_entity_1.SimulationHistory)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        risk_engine_service_1.RiskEngineService,
        allocation_engine_service_1.AllocationEngineService,
        projection_engine_service_1.ProjectionEngineService])
], SimulatorService);
//# sourceMappingURL=simulator.service.js.map