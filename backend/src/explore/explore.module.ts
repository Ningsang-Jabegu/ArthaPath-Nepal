import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InvestmentCategory } from '../entities/investment-category.entity';
import { ExploreService } from './explore.service';
import { ExploreController } from './explore.controller';

@Module({
  imports: [TypeOrmModule.forFeature([InvestmentCategory])],
  controllers: [ExploreController],
  providers: [ExploreService],
  exports: [ExploreService],
})
export class ExploreModule {}
