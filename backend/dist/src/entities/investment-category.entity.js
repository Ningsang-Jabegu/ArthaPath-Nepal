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
exports.InvestmentCategory = void 0;
const typeorm_1 = require("typeorm");
let InvestmentCategory = class InvestmentCategory {
    id;
    name;
    type;
    expected_return_min;
    expected_return_max;
    risk_level;
    liquidity_score;
    lock_in_period;
    minimum_capital;
    description;
    created_at;
    updated_at;
};
exports.InvestmentCategory = InvestmentCategory;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], InvestmentCategory.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], InvestmentCategory.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: ['Stocks', 'Mutual Fund', 'Bond', 'FD', 'Gold', 'Real Estate', 'Business'],
    }),
    __metadata("design:type", String)
], InvestmentCategory.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'float' }),
    __metadata("design:type", Number)
], InvestmentCategory.prototype, "expected_return_min", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'float' }),
    __metadata("design:type", Number)
], InvestmentCategory.prototype, "expected_return_max", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: ['Low', 'Medium', 'High'],
    }),
    __metadata("design:type", String)
], InvestmentCategory.prototype, "risk_level", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'float' }),
    __metadata("design:type", Number)
], InvestmentCategory.prototype, "liquidity_score", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], InvestmentCategory.prototype, "lock_in_period", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], InvestmentCategory.prototype, "minimum_capital", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], InvestmentCategory.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], InvestmentCategory.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], InvestmentCategory.prototype, "updated_at", void 0);
exports.InvestmentCategory = InvestmentCategory = __decorate([
    (0, typeorm_1.Entity)('investment_categories')
], InvestmentCategory);
//# sourceMappingURL=investment-category.entity.js.map