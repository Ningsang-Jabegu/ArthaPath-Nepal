import { DataSource } from 'typeorm';
import { InvestmentCategory } from '../src/entities/investment-category.entity';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

class DataVerification {
  private dataSource: DataSource;

  constructor() {
    this.dataSource = new DataSource({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432', 10),
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      database: process.env.DB_DATABASE || 'arthapath_nepal',
      entities: [InvestmentCategory],
      synchronize: false,
    });
  }

  async connect(): Promise<void> {
    await this.dataSource.initialize();
    console.log('✓ Database connection successful');
  }

  async disconnect(): Promise<void> {
    await this.dataSource.destroy();
  }

  async verifyInvestmentCategories(): Promise<ValidationResult> {
    const errors: string[] = [];
    const warnings: string[] = [];

    const categoryRepo = this.dataSource.getRepository(InvestmentCategory);
    const categories = await categoryRepo.find();

    // Check 1: Count verification
    console.log(`✓ Found ${categories.length} investment categories`);
    if (categories.length === 0) {
      errors.push('No investment categories found in database');
      return { isValid: false, errors, warnings };
    }

    if (categories.length !== 7) {
      warnings.push(
        `Expected 7 categories, found ${categories.length}. Additional categories may have been added.`,
      );
    }

    // Check 2: Required categories
    const expectedCategories = [
      'Stocks',
      'Mutual Funds',
      'Bonds',
      'Fixed Deposit (FD)',
      'Gold',
      'Real Estate',
      'Business',
    ];

    const foundNames = categories.map((c) => c.name);
    const missingCategories = expectedCategories.filter(
      (name) => !foundNames.includes(name),
    );

    if (missingCategories.length > 0) {
      errors.push(
        `Missing required categories: ${missingCategories.join(', ')}`,
      );
    }

    // Check 3: Data integrity for each category
    let validCategories = 0;
    for (const category of categories) {
      const categoryErrors = this.validateCategory(category);
      if (categoryErrors.length === 0) {
        validCategories++;
      } else {
        errors.push(
          `Category "${category.name}": ${categoryErrors.join(', ')}`,
        );
      }
    }

    console.log(`✓ ${validCategories}/${categories.length} categories have valid data`);

    // Check 4: Risk level distribution
    const riskDistribution = {
      Low: categories.filter((c) => c.risk_level === 'Low').length,
      Medium: categories.filter((c) => c.risk_level === 'Medium').length,
      High: categories.filter((c) => c.risk_level === 'High').length,
    };

    console.log(
      `✓ Risk level distribution: Low (${riskDistribution.Low}), Medium (${riskDistribution.Medium}), High (${riskDistribution.High})`,
    );

    if (riskDistribution.Low === 0) {
      warnings.push('No low-risk investment categories found');
    }
    if (riskDistribution.High === 0) {
      warnings.push('No high-risk investment categories found');
    }

    // Check 5: Duplicate detection
    const duplicates = this.findDuplicates(categories);
    if (duplicates.length > 0) {
      errors.push(`Duplicate categories found: ${duplicates.join(', ')}`);
    } else {
      console.log('✓ No duplicates detected');
    }

    // Check 6: Return rate reasonableness
    const unreasonableRates = categories.filter(
      (c) =>
        c.expected_return_min < 0 ||
        c.expected_return_max > 50 ||
        c.expected_return_min >= c.expected_return_max,
    );

    if (unreasonableRates.length > 0) {
      warnings.push(
        `Categories with unusual return rates: ${unreasonableRates.map((c) => c.name).join(', ')}`,
      );
    }

    // Check 7: Liquidity score validation
    const invalidLiquidity = categories.filter(
      (c) => c.liquidity_score < 0 || c.liquidity_score > 10,
    );

    if (invalidLiquidity.length > 0) {
      errors.push(
        `Invalid liquidity scores in: ${invalidLiquidity.map((c) => c.name).join(', ')}`,
      );
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }

  private validateCategory(category: InvestmentCategory): string[] {
    const errors: string[] = [];

    // Required fields
    if (!category.name) errors.push('Name is missing');
    if (!category.type) errors.push('Type is missing');
    if (!category.description) errors.push('Description is missing');
    if (!category.lock_in_period) errors.push('Lock-in period is missing');

    // Numeric validations
    if (
      category.expected_return_min === null ||
      category.expected_return_min === undefined
    ) {
      errors.push('Expected return min is missing');
    }
    if (
      category.expected_return_max === null ||
      category.expected_return_max === undefined
    ) {
      errors.push('Expected return max is missing');
    }
    if (
      category.liquidity_score === null ||
      category.liquidity_score === undefined
    ) {
      errors.push('Liquidity score is missing');
    }
    if (
      category.minimum_capital === null ||
      category.minimum_capital === undefined
    ) {
      errors.push('Minimum capital is missing');
    }

    // Range validations
    if (category.expected_return_min > category.expected_return_max) {
      errors.push('Min return cannot be greater than max return');
    }

    if (category.expected_return_min < 0 || category.expected_return_max > 100) {
      errors.push('Return rates must be between 0 and 100');
    }

    if (category.liquidity_score < 0 || category.liquidity_score > 10) {
      errors.push('Liquidity score must be between 0 and 10');
    }

    if (category.minimum_capital < 0) {
      errors.push('Minimum capital cannot be negative');
    }

    // Risk level validation
    if (!['Low', 'Medium', 'High'].includes(category.risk_level)) {
      errors.push('Invalid risk level (must be Low, Medium, or High)');
    }

    // Description length
    if (category.description && category.description.length < 10) {
      errors.push('Description too short (minimum 10 characters)');
    }

    return errors;
  }

  private findDuplicates(categories: InvestmentCategory[]): string[] {
    const duplicates: string[] = [];
    const seen = new Map<string, number>();

    categories.forEach((category) => {
      const key = category.name.toLowerCase();
      seen.set(key, (seen.get(key) || 0) + 1);
    });

    seen.forEach((count, name) => {
      if (count > 1) {
        duplicates.push(`${name} (${count} times)`);
      }
    });

    return duplicates;
  }

  async generateReport(): Promise<void> {
    console.log('\n=== ArthaPath Nepal - Data Verification Report ===\n');
    console.log(`Timestamp: ${new Date().toISOString()}\n`);

    const result = await this.verifyInvestmentCategories();

    if (result.isValid) {
      console.log('\n✓ Data verification complete - No errors found\n');
    } else {
      console.log('\n✗ Data verification found errors:\n');
      result.errors.forEach((error) => {
        console.error(`  ✗ ${error}`);
      });
    }

    if (result.warnings.length > 0) {
      console.log('\n⚠ Warnings:\n');
      result.warnings.forEach((warning) => {
        console.warn(`  ⚠ ${warning}`);
      });
    }

    console.log('\n================================================\n');

    if (!result.isValid) {
      process.exit(1);
    }
  }
}

async function main() {
  const verification = new DataVerification();

  try {
    await verification.connect();
    await verification.generateReport();
  } catch (error) {
    console.error('Error during data verification:', error);
    process.exit(1);
  } finally {
    await verification.disconnect();
  }
}

main();
