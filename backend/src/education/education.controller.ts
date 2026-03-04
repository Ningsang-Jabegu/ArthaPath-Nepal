import { Controller, Get, Query, ValidationPipe } from '@nestjs/common';
import { EducationService } from './education.service';
import { EducationArticle } from '../entities/education-article.entity';
import { FilterEducationArticleDto } from './dto/filter-education-article.dto';

@Controller('education/articles')
export class EducationController {
  constructor(private readonly educationService: EducationService) {}

  @Get()
  async getAllArticles(): Promise<EducationArticle[]> {
    return this.educationService.findAll();
  }

  @Get('filter')
  async filterArticles(
    @Query(ValidationPipe) filterDto: FilterEducationArticleDto,
  ): Promise<EducationArticle[]> {
    return this.educationService.filter(filterDto);
  }
}
