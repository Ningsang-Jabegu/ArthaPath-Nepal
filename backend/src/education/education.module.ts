import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EducationArticle } from '../entities/education-article.entity';
import { EducationController } from './education.controller';
import { EducationService } from './education.service';

@Module({
  imports: [TypeOrmModule.forFeature([EducationArticle])],
  controllers: [EducationController],
  providers: [EducationService],
  exports: [EducationService],
})
export class EducationModule {}
