"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectionEngineService = void 0;
const common_1 = require("@nestjs/common");
let ProjectionEngineService = class ProjectionEngineService {
    calculateProjection(initialCapital, monthlyContribution, durationYears, riskProfile) {
        const returnRates = this.getReturnRates(riskProfile);
        const conservative = this.calculateFutureValue(initialCapital, monthlyContribution, durationYears, returnRates.conservative);
        const expected = this.calculateFutureValue(initialCapital, monthlyContribution, durationYears, returnRates.expected);
        const optimistic = this.calculateFutureValue(initialCapital, monthlyContribution, durationYears, returnRates.optimistic);
        const totalContributions = initialCapital + monthlyContribution * 12 * durationYears;
        return {
            conservative: Math.round(conservative),
            expected: Math.round(expected),
            optimistic: Math.round(optimistic),
            total_contributions: totalContributions,
            estimated_gain_conservative: Math.round(conservative - totalContributions),
            estimated_gain_expected: Math.round(expected - totalContributions),
            estimated_gain_optimistic: Math.round(optimistic - totalContributions),
        };
    }
    getReturnRates(riskProfile) {
        switch (riskProfile) {
            case 'Conservative':
                return {
                    conservative: 0.06,
                    expected: 0.08,
                    optimistic: 0.10,
                };
            case 'Balanced':
                return {
                    conservative: 0.08,
                    expected: 0.11,
                    optimistic: 0.14,
                };
            case 'Aggressive':
                return {
                    conservative: 0.10,
                    expected: 0.14,
                    optimistic: 0.18,
                };
        }
    }
    calculateFutureValue(principal, monthlyContribution, years, annualRate) {
        const monthlyRate = annualRate / 12;
        const months = years * 12;
        const fvPrincipal = principal * Math.pow(1 + monthlyRate, months);
        let fvContributions = 0;
        if (monthlyContribution > 0 && monthlyRate > 0) {
            fvContributions =
                monthlyContribution *
                    ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);
        }
        return fvPrincipal + fvContributions;
    }
    generateYearlyProjection(initialCapital, monthlyContribution, durationYears, riskProfile) {
        const returnRates = this.getReturnRates(riskProfile);
        const yearlyData = [];
        for (let year = 0; year <= durationYears; year++) {
            yearlyData.push({
                year,
                conservative: Math.round(this.calculateFutureValue(initialCapital, monthlyContribution, year, returnRates.conservative)),
                expected: Math.round(this.calculateFutureValue(initialCapital, monthlyContribution, year, returnRates.expected)),
                optimistic: Math.round(this.calculateFutureValue(initialCapital, monthlyContribution, year, returnRates.optimistic)),
            });
        }
        return yearlyData;
    }
};
exports.ProjectionEngineService = ProjectionEngineService;
exports.ProjectionEngineService = ProjectionEngineService = __decorate([
    (0, common_1.Injectable)()
], ProjectionEngineService);
//# sourceMappingURL=projection-engine.service.js.map