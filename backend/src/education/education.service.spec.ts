import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EducationService } from './education.service';
import { EducationArticle } from '../entities/education-article.entity';
import { FilterEducationArticleDto } from './dto/filter-education-article.dto';

describe('EducationService', () => {
  let service: EducationService;
  let repository: Repository<EducationArticle>;

  const mockArticles: EducationArticle[] = [
    {
      id: '1',
      title: 'Stocks in Nepal: Basics, Risks, and Suitability',
      category: 'Stocks',
      content: 'Stocks content',
      risk_icon: 'high',
      image: '/images/education/stocks-nepal.jpg',
      created_at: new Date('2026-01-01'),
      updated_at: new Date('2026-01-01'),
    },
    {
      id: '2',
      title: 'Risk and Diversification: Core Principles for Every Investor',
      category: 'General',
      content: 'General content',
      risk_icon: 'medium',
      image: '/images/education/risk-diversification.jpg',
      created_at: new Date('2026-01-01'),
      updated_at: new Date('2026-01-01'),
    },
  ];

  const mockQueryBuilder = {
    andWhere: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    getMany: jest.fn(),
  };

  const mockRepository = {
    find: jest.fn(),
    count: jest.fn(),
    save: jest.fn(),
    createQueryBuilder: jest.fn(() => mockQueryBuilder),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EducationService,
        {
          provide: getRepositoryToken(EducationArticle),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<EducationService>(EducationService);
    repository = module.get<Repository<EducationArticle>>(
      getRepositoryToken(EducationArticle),
    );

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('returns all articles ordered by title', async () => {
      mockRepository.find.mockResolvedValue(mockArticles);

      const result = await service.findAll();

      expect(mockRepository.find).toHaveBeenCalledWith({
        order: { title: 'ASC' },
      });
      expect(result).toEqual(mockArticles);
    });
  });

  describe('filter', () => {
    it('returns filtered articles by category', async () => {
      const filterDto: FilterEducationArticleDto = {
        category: 'General',
      };
      mockQueryBuilder.getMany.mockResolvedValue([mockArticles[1]]);

      const result = await service.filter(filterDto);

      expect(mockRepository.createQueryBuilder).toHaveBeenCalledWith('article');
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'article.category = :category',
        { category: 'General' },
      );
      expect(mockQueryBuilder.orderBy).toHaveBeenCalledWith('article.title', 'ASC');
      expect(result).toEqual([mockArticles[1]]);
    });

    it('returns all articles when filter is empty', async () => {
      mockQueryBuilder.getMany.mockResolvedValue(mockArticles);

      const result = await service.filter({});

      expect(mockQueryBuilder.andWhere).not.toHaveBeenCalled();
      expect(mockQueryBuilder.orderBy).toHaveBeenCalledWith('article.title', 'ASC');
      expect(result).toEqual(mockArticles);
    });
  });

  describe('onModuleInit', () => {
    it('seeds articles when repository is empty', async () => {
      mockRepository.count.mockResolvedValue(0);
      mockRepository.save.mockResolvedValue([]);

      await service.onModuleInit();

      expect(mockRepository.count).toHaveBeenCalled();
      expect(mockRepository.save).toHaveBeenCalledTimes(1);
      expect(mockRepository.save.mock.calls[0][0]).toHaveLength(11);
    });

    it('does not seed when articles already exist', async () => {
      mockRepository.count.mockResolvedValue(3);

      await service.onModuleInit();

      expect(mockRepository.count).toHaveBeenCalled();
      expect(mockRepository.save).not.toHaveBeenCalled();
    });
  });
});
