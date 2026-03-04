import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AdminService, UsageAnalytics } from './admin.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../entities/user.entity';
import { InvestmentCategory } from '../entities/investment-category.entity';
import { CreateInvestmentCategoryDto } from './dto/create-investment-category.dto';
import { UpdateInvestmentCategoryDto } from './dto/update-investment-category.dto';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // Investment Category Management

  @Post('categories')
  async createCategory(
    @Body(ValidationPipe) dto: CreateInvestmentCategoryDto,
  ): Promise<InvestmentCategory> {
    return this.adminService.createCategory(dto);
  }

  @Get('categories')
  async getAllCategories(): Promise<InvestmentCategory[]> {
    return this.adminService.getAllCategories();
  }

  @Get('categories/:id')
  async getCategoryById(
    @Param('id') id: string,
  ): Promise<InvestmentCategory> {
    return this.adminService.getCategoryById(id);
  }

  @Put('categories/:id')
  async updateCategory(
    @Param('id') id: string,
    @Body(ValidationPipe) dto: UpdateInvestmentCategoryDto,
  ): Promise<InvestmentCategory> {
    return this.adminService.updateCategory(id, dto);
  }

  @Delete('categories/:id')
  async deleteCategory(@Param('id') id: string): Promise<{ message: string }> {
    await this.adminService.deleteCategory(id);
    return { message: 'Investment category deleted successfully' };
  }

  // Analytics

  @Get('analytics')
  async getUsageAnalytics(): Promise<UsageAnalytics> {
    return this.adminService.getUsageAnalytics();
  }
}
