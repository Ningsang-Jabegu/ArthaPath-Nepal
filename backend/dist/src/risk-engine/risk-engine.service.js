"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RiskEngineService = void 0;
const common_1 = require("@nestjs/common");
let RiskEngineService = class RiskEngineService {
    calculateRiskProfile(durationYears, liquidityNeed, riskTolerance, hasEmergencyFund) {
        let riskScore = 0;
        if (durationYears >= 15) {
            riskScore += 40;
        }
        else if (durationYears >= 10) {
            riskScore += 30;
        }
        else if (durationYears >= 5) {
            riskScore += 20;
        }
        else {
            riskScore += 10;
        }
        if (liquidityNeed === 'Low') {
            riskScore += 20;
        }
        else if (liquidityNeed === 'Medium') {
            riskScore += 10;
        }
        else {
            riskScore += 0;
        }
        if (riskTolerance === 'High') {
            riskScore += 30;
        }
        else if (riskTolerance === 'Medium') {
            riskScore += 15;
        }
        else {
            riskScore += 0;
        }
        if (hasEmergencyFund) {
            riskScore += 10;
        }
        if (riskScore <= 35) {
            return 'Conservative';
        }
        else if (riskScore <= 65) {
            return 'Balanced';
        }
        else {
            return 'Aggressive';
        }
    }
};
exports.RiskEngineService = RiskEngineService;
exports.RiskEngineService = RiskEngineService = __decorate([
    (0, common_1.Injectable)()
], RiskEngineService);
//# sourceMappingURL=risk-engine.service.js.map