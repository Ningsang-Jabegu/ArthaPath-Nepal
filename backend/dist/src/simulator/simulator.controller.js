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
exports.SimulatorController = void 0;
const common_1 = require("@nestjs/common");
const simulator_service_1 = require("./simulator.service");
const user_input_dto_1 = require("./dto/user-input.dto");
let SimulatorController = class SimulatorController {
    simulatorService;
    constructor(simulatorService) {
        this.simulatorService = simulatorService;
    }
    async runSimulation(userInput) {
        return this.simulatorService.runSimulation(userInput);
    }
};
exports.SimulatorController = SimulatorController;
__decorate([
    (0, common_1.Post)('run'),
    __param(0, (0, common_1.Body)(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_input_dto_1.UserInputDto]),
    __metadata("design:returntype", Promise)
], SimulatorController.prototype, "runSimulation", null);
exports.SimulatorController = SimulatorController = __decorate([
    (0, common_1.Controller)('simulator'),
    __metadata("design:paramtypes", [simulator_service_1.SimulatorService])
], SimulatorController);
//# sourceMappingURL=simulator.controller.js.map