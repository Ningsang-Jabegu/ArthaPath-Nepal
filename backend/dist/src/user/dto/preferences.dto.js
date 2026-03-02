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
exports.UpdatePreferencesDto = exports.CreatePreferencesDto = void 0;
const class_validator_1 = require("class-validator");
var RiskTolerance;
(function (RiskTolerance) {
    RiskTolerance["Low"] = "Low";
    RiskTolerance["Medium"] = "Medium";
    RiskTolerance["High"] = "High";
})(RiskTolerance || (RiskTolerance = {}));
var LiquidityNeed;
(function (LiquidityNeed) {
    LiquidityNeed["Low"] = "Low";
    LiquidityNeed["Medium"] = "Medium";
    LiquidityNeed["High"] = "High";
})(LiquidityNeed || (LiquidityNeed = {}));
class CreatePreferencesDto {
    risk_tolerance;
    liquidity_need;
    has_emergency_fund;
}
exports.CreatePreferencesDto = CreatePreferencesDto;
__decorate([
    (0, class_validator_1.IsEnum)(RiskTolerance),
    __metadata("design:type", String)
], CreatePreferencesDto.prototype, "risk_tolerance", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(LiquidityNeed),
    __metadata("design:type", String)
], CreatePreferencesDto.prototype, "liquidity_need", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreatePreferencesDto.prototype, "has_emergency_fund", void 0);
class UpdatePreferencesDto {
    risk_tolerance;
    liquidity_need;
    has_emergency_fund;
}
exports.UpdatePreferencesDto = UpdatePreferencesDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(RiskTolerance),
    __metadata("design:type", String)
], UpdatePreferencesDto.prototype, "risk_tolerance", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(LiquidityNeed),
    __metadata("design:type", String)
], UpdatePreferencesDto.prototype, "liquidity_need", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdatePreferencesDto.prototype, "has_emergency_fund", void 0);
//# sourceMappingURL=preferences.dto.js.map