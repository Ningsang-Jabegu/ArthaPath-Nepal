import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InvestmentCategory } from '../entities/investment-category.entity';
import { User, UserRole } from '../entities/user.entity';
import { CreateInvestmentCategoryDto } from './dto/create-investment-category.dto';
import { UpdateInvestmentCategoryDto } from './dto/update-investment-category.dto';

export interface UsageAnalytics {
  totalUsers: number;
  totalInvestmentCategories: number;
  usersByRole: {
    admin: number;
    user: number;
  };
  categoriesByRiskLevel: {
    Low: number;
    Medium: number;
    High: number;
  };
  categoriesByType: Record<string, number>;
  recentUsers: Array<{
    id: string;
    email: string;
    name: string;
    created_at: Date;
  }>;
}

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(InvestmentCategory)
    private readonly categoryRepository: Repository<InvestmentCategory>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  // Investment Category CRUD operations

  async createCategory(
    dto: CreateInvestmentCategoryDto,
  ): Promise<InvestmentCategory> {
    const category = this.categoryRepository.create(dto);
    return this.categoryRepository.save(category);
  }

  async getAllCategories(): Promise<InvestmentCategory[]> {
    return this.categoryRepository.find({
      order: { name: 'ASC' },
    });
  }

  async getCategoryById(id: string): Promise<InvestmentCategory> {
    const category = await this.categoryRepository.findOne({ where: { id } });
    if (!category) {
      throw new NotFoundException(`Investment category with ID ${id} not found`);
    }
    return category;
  }

  async updateCategory(
    id: string,
    dto: UpdateInvestmentCategoryDto,
  ): Promise<InvestmentCategory> {
    const category = await this.getCategoryById(id);
    Object.assign(category, dto);
    return this.categoryRepository.save(category);
  }

  async deleteCategory(id: string): Promise<void> {
    const category = await this.getCategoryById(id);
    await this.categoryRepository.remove(category);
  }

  // Analytics

  async getUsageAnalytics(): Promise<UsageAnalytics> {
    // Get total users
    const totalUsers = await this.userRepository.count();

    // Get total investment categories
    const totalInvestmentCategories = await this.categoryRepository.count();

    // Get users by role
    const adminCount = await this.userRepository.count({
      where: { role: UserRole.ADMIN },
    });
    const userCount = totalUsers - adminCount;

    // Get categories by risk level
    const lowRiskCount = await this.categoryRepository.count({
      where: { risk_level: 'Low' },
    });
    const mediumRiskCount = await this.categoryRepository.count({
      where: { risk_level: 'Medium' },
    });
    const highRiskCount = await this.categoryRepository.count({
      where: { risk_level: 'High' },
    });

    // Get categories by type
    const categories = await this.categoryRepository.find();
    const categoriesByType: Record<string, number> = {};
    categories.forEach((cat) => {
      categoriesByType[cat.type] = (categoriesByType[cat.type] || 0) + 1;
    });

    // Get recent users (last 10)
    const recentUsers = await this.userRepository.find({
      select: ['id', 'email', 'name', 'created_at'],
      order: { created_at: 'DESC' },
      take: 10,
    });

    return {
      totalUsers,
      totalInvestmentCategories,
      usersByRole: {
        admin: adminCount,
        user: userCount,
      },
      categoriesByRiskLevel: {
        Low: lowRiskCount,
        Medium: mediumRiskCount,
        High: highRiskCount,
      },
      categoriesByType,
      recentUsers: recentUsers.map((user) => ({
        id: user.id,
        email: user.email,
        name: user.name,
        created_at: user.created_at,
      })),
    };
  }
}
