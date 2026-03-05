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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserPreference = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("./user.entity");
let UserPreference = class UserPreference {
    id;
    user;
    user_id;
    risk_tolerance;
    liquidity_need;
    has_emergency_fund;
    created_at;
    updated_at;
};
exports.UserPreference = UserPreference;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], UserPreference.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => user_entity_1.User, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", typeof (_a = typeof user_entity_1.User !== "undefined" && user_entity_1.User) === "function" ? _a : Object)
], UserPreference.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], UserPreference.prototype, "user_id", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: ['Low', 'Medium', 'High'],
        default: 'Medium',
    }),
    __metadata("design:type", String)
], UserPreference.prototype, "risk_tolerance", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: ['Low', 'Medium', 'High'],
        default: 'Medium',
    }),
    __metadata("design:type", String)
], UserPreference.prototype, "liquidity_need", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], UserPreference.prototype, "has_emergency_fund", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], UserPreference.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], UserPreference.prototype, "updated_at", void 0);
exports.UserPreference = UserPreference = __decorate([
    (0, typeorm_1.Entity)('user_preferences')
], UserPreference);
//# sourceMappingURL=user-preference.entity.js.map