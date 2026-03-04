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
exports.AiExplanationResponseDto = exports.AiExplanationRequestDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class ProjectionDataDto {
    conservative;
    expected;
    optimistic;
    total_contributions;
}
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], ProjectionDataDto.prototype, "conservative", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], ProjectionDataDto.prototype, "expected", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], ProjectionDataDto.prototype, "optimistic", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], ProjectionDataDto.prototype, "total_contributions", void 0);
class AiExplanationRequestDto {
    risk_profile;
    allocation;
    capital_distribution;
    projection;
    time_horizon;
    monthly_contribution = 0;
    risk_tolerance;
    liquidity_need;
    explanation_type = 'narrative';
}
exports.AiExplanationRequestDto = AiExplanationRequestDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AiExplanationRequestDto.prototype, "risk_profile", void 0);
__decorate([
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], AiExplanationRequestDto.prototype, "allocation", void 0);
__decorate([
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], AiExplanationRequestDto.prototype, "capital_distribution", void 0);
__decorate([
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => ProjectionDataDto),
    __metadata("design:type", ProjectionDataDto)
], AiExplanationRequestDto.prototype, "projection", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], AiExplanationRequestDto.prototype, "time_horizon", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], AiExplanationRequestDto.prototype, "monthly_contribution", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(['LOW', 'MEDIUM', 'HIGH']),
    __metadata("design:type", String)
], AiExplanationRequestDto.prototype, "risk_tolerance", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(['LOW', 'MEDIUM', 'HIGH']),
    __metadata("design:type", String)
], AiExplanationRequestDto.prototype, "liquidity_need", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(['allocation', 'risk_profile', 'time_horizon', 'narrative']),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], AiExplanationRequestDto.prototype, "explanation_type", void 0);
class AiExplanationResponseDto {
    explanation;
    type;
    generated_at;
    model;
}
exports.AiExplanationResponseDto = AiExplanationResponseDto;
//# sourceMappingURL=ai-explanation.dto.js.map