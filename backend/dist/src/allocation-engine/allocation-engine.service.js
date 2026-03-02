"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AllocationEngineService = void 0;
const common_1 = require("@nestjs/common");
let AllocationEngineService = class AllocationEngineService {
    generateAllocation(riskProfile, durationYears, initialCapital) {
        let baseAllocation = this.getBaseAllocation(riskProfile);
        if (durationYears >= 15) {
            baseAllocation = this.adjustForLongTerm(baseAllocation, riskProfile);
        }
        else if (durationYears < 5) {
            baseAllocation = this.adjustForShortTerm(baseAllocation);
        }
        if (initialCapital < 50000) {
            baseAllocation['Real Estate'] = 0;
            baseAllocation = this.redistributeZeroCategories(baseAllocation);
        }
        return this.normalizeAllocation(baseAllocation);
    }
    getBaseAllocation(riskProfile) {
        switch (riskProfile) {
            case 'Conservative':
                return {
                    'Mutual Fund': 25,
                    Stocks: 10,
                    'Fixed Deposit': 40,
                    Bonds: 15,
                    Gold: 10,
                    'Real Estate': 0,
                    Business: 0,
                };
            case 'Balanced':
                return {
                    'Mutual Fund': 35,
                    Stocks: 25,
                    'Fixed Deposit': 20,
                    Bonds: 10,
                    Gold: 10,
                    'Real Estate': 0,
                    Business: 0,
                };
            case 'Aggressive':
                return {
                    'Mutual Fund': 25,
                    Stocks: 50,
                    'Fixed Deposit': 10,
                    Bonds: 5,
                    Gold: 5,
                    'Real Estate': 0,
                    Business: 5,
                };
        }
    }
    adjustForLongTerm(allocation, riskProfile) {
        if (riskProfile === 'Conservative') {
            allocation.Stocks += 5;
            allocation['Mutual Fund'] += 5;
            allocation['Fixed Deposit'] -= 10;
        }
        else if (riskProfile === 'Balanced') {
            allocation.Stocks += 10;
            allocation['Fixed Deposit'] -= 10;
        }
        else {
            allocation.Stocks += 5;
            allocation.Business += 5;
            allocation['Fixed Deposit'] -= 10;
        }
        return allocation;
    }
    adjustForShortTerm(allocation) {
        const stockReduction = Math.floor(allocation.Stocks * 0.3);
        const businessReduction = allocation.Business;
        allocation.Stocks -= stockReduction;
        allocation.Business = 0;
        allocation['Fixed Deposit'] += stockReduction + businessReduction;
        return allocation;
    }
    redistributeZeroCategories(allocation) {
        const activeCategories = Object.keys(allocation).filter((key) => allocation[key] > 0);
        if (activeCategories.length === 0)
            return allocation;
        const totalActive = activeCategories.reduce((sum, key) => sum + allocation[key], 0);
        const scaleFactor = 100 / totalActive;
        activeCategories.forEach((key) => {
            allocation[key] = Math.round(allocation[key] * scaleFactor);
        });
        return allocation;
    }
    normalizeAllocation(allocation) {
        const total = Object.values(allocation).reduce((sum, val) => sum + val, 0);
        if (total === 100)
            return allocation;
        const diff = 100 - total;
        const largestKey = Object.keys(allocation).reduce((a, b) => allocation[a] >
            allocation[b]
            ? a
            : b);
        allocation[largestKey] += diff;
        return allocation;
    }
    calculateCapitalDistribution(allocation, totalCapital) {
        const distribution = {};
        Object.keys(allocation).forEach((category) => {
            const percentage = allocation[category];
            distribution[category] = Math.round((percentage / 100) * totalCapital);
        });
        return distribution;
    }
};
exports.AllocationEngineService = AllocationEngineService;
exports.AllocationEngineService = AllocationEngineService = __decorate([
    (0, common_1.Injectable)()
], AllocationEngineService);
//# sourceMappingURL=allocation-engine.service.js.map