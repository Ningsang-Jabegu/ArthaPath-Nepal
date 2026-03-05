import { Controller, Get, Query, ValidationPipe, ParseIntPipe } from '@nestjs/common';
import { EducationService } from './education.service';
import { EducationArticle } from '../entities/education-article.entity';
import { FilterEducationArticleDto } from './dto/filter-education-article.dto';

@Controller('education/articles')
export class EducationController {
  constructor(private readonly educationService: EducationService) {}

  @Get()
  async getAllArticles(
    @Query('page', new ParseIntPipe({ optional: true })) page?: number,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
  ) {
    return this.educationService.findAll(page, limit);
  }

  @Get('filter')
  async filterArticles(
    @Query(ValidationPipe) filterDto: FilterEducationArticleDto,
  ): Promise<EducationArticle[]> {
    return this.educationService.filter(filterDto);
  }
}
