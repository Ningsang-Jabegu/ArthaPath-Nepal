"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SimulatorModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const simulator_controller_1 = require("./simulator.controller");
const simulator_service_1 = require("./simulator.service");
const simulation_history_entity_1 = require("../entities/simulation-history.entity");
const risk_engine_service_1 = require("../risk-engine/risk-engine.service");
const allocation_engine_service_1 = require("../allocation-engine/allocation-engine.service");
const projection_engine_service_1 = require("../projection-engine/projection-engine.service");
let SimulatorModule = class SimulatorModule {
};
exports.SimulatorModule = SimulatorModule;
exports.SimulatorModule = SimulatorModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([simulation_history_entity_1.SimulationHistory])],
        controllers: [simulator_controller_1.SimulatorController],
        providers: [
            simulator_service_1.SimulatorService,
            risk_engine_service_1.RiskEngineService,
            allocation_engine_service_1.AllocationEngineService,
            projection_engine_service_1.ProjectionEngineService,
        ],
    })
], SimulatorModule);
//# sourceMappingURL=simulator.module.js.map