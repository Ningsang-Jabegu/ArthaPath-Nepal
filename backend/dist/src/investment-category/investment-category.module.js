"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvestmentCategoryModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const investment_category_entity_1 = require("../entities/investment-category.entity");
const investment_category_controller_1 = require("./investment-category.controller");
const investment_category_service_1 = require("./investment-category.service");
let InvestmentCategoryModule = class InvestmentCategoryModule {
};
exports.InvestmentCategoryModule = InvestmentCategoryModule;
exports.InvestmentCategoryModule = InvestmentCategoryModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([investment_category_entity_1.InvestmentCategory])],
        controllers: [investment_category_controller_1.InvestmentCategoryController],
        providers: [investment_category_service_1.InvestmentCategoryService],
        exports: [investment_category_service_1.InvestmentCategoryService],
    })
], InvestmentCategoryModule);
//# sourceMappingURL=investment-category.module.js.map