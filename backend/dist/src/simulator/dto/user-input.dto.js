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
exports.UserInputDto = void 0;
const class_validator_1 = require("class-validator");
class UserInputDto {
    initial_capital;
    monthly_contribution;
    duration_years;
    risk_tolerance;
    liquidity_need;
    has_emergency_fund;
}
exports.UserInputDto = UserInputDto;
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(5000),
    __metadata("design:type", Number)
], UserInputDto.prototype, "initial_capital", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], UserInputDto.prototype, "monthly_contribution", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(50),
    __metadata("design:type", Number)
], UserInputDto.prototype, "duration_years", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(['Low', 'Medium', 'High']),
    __metadata("design:type", String)
], UserInputDto.prototype, "risk_tolerance", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(['Low', 'Medium', 'High']),
    __metadata("design:type", String)
], UserInputDto.prototype, "liquidity_need", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UserInputDto.prototype, "has_emergency_fund", void 0);
//# sourceMappingURL=user-input.dto.js.map