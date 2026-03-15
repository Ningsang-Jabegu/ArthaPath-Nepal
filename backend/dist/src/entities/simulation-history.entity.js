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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SimulationHistory = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("./user.entity");
let SimulationHistory = class SimulationHistory {
    id;
    user;
    user_id;
    initial_capital;
    monthly_contribution;
    duration_years;
    risk_tolerance;
    liquidity_need;
    has_emergency_fund;
    allocation_result;
    projection_result;
    risk_profile;
    created_at;
};
exports.SimulationHistory = SimulationHistory;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], SimulationHistory.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", user_entity_1.User)
], SimulationHistory.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], SimulationHistory.prototype, "user_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], SimulationHistory.prototype, "initial_capital", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], SimulationHistory.prototype, "monthly_contribution", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], SimulationHistory.prototype, "duration_years", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: ['Low', 'Medium', 'High'],
    }),
    __metadata("design:type", String)
], SimulationHistory.prototype, "risk_tolerance", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: ['Low', 'Medium', 'High'],
    }),
    __metadata("design:type", String)
], SimulationHistory.prototype, "liquidity_need", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean' }),
    __metadata("design:type", Boolean)
], SimulationHistory.prototype, "has_emergency_fund", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json' }),
    __metadata("design:type", Object)
], SimulationHistory.prototype, "allocation_result", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json' }),
    __metadata("design:type", Object)
], SimulationHistory.prototype, "projection_result", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: ['Conservative', 'Balanced', 'Aggressive'],
    }),
    __metadata("design:type", String)
], SimulationHistory.prototype, "risk_profile", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], SimulationHistory.prototype, "created_at", void 0);
exports.SimulationHistory = SimulationHistory = __decorate([
    (0, typeorm_1.Entity)('simulation_history'),
    (0, typeorm_1.Index)(['user_id', 'created_at']),
    (0, typeorm_1.Index)(['user_id'])
], SimulationHistory);
//# sourceMappingURL=simulation-history.entity.js.map