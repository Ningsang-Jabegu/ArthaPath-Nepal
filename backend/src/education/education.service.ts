import { Injectable, OnModuleInit, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EducationArticle } from '../entities/education-article.entity';
import { FilterEducationArticleDto } from './dto/filter-education-article.dto';

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

@Injectable()
export class EducationService implements OnModuleInit {
  constructor(
    @InjectRepository(EducationArticle)
    private readonly educationArticleRepository: Repository<EducationArticle>,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.seedArticlesIfEmpty();
  }

  async findAll(page?: number, limit?: number): Promise<PaginatedResult<EducationArticle>> {
    const pageNum = Math.max(1, page || 1);
    const limitNum = Math.min(100, Math.max(1, limit || 20));
    const skip = (pageNum - 1) * limitNum;

    const [data, total] = await Promise.all([
      this.educationArticleRepository.find({
        select: ['id', 'title', 'category', 'created_at'],
        order: { title: 'ASC' },
        skip,
        take: limitNum,
      }),
      this.educationArticleRepository.count(),
    ]);

    return { data, total, page: pageNum, limit: limitNum };
  }

  async findOne(id: string): Promise<EducationArticle | null> {
    return this.educationArticleRepository.findOne({ where: { id } });
  }

  async filter(
    filterDto: FilterEducationArticleDto,
  ): Promise<EducationArticle[]> {
    const query = this.educationArticleRepository.createQueryBuilder('article');

    if (filterDto.category) {
      query.andWhere('article.category = :category', {
        category: filterDto.category,
      });
    }

    query.orderBy('article.title', 'ASC');

    return query.getMany();
  }

  private async seedArticlesIfEmpty(): Promise<void> {
    const articleCount = await this.educationArticleRepository.count();

    if (articleCount > 0) {
      return;
    }

    const articles: Array<Partial<EducationArticle>> = [
      {
        title: 'Stocks in Nepal: Basics, Risks, and Suitability',
        category: 'Stocks',
        risk_icon: 'high',
        image: '/images/education/stocks-nepal.jpg',
        content:
          'Stocks represent partial ownership in a listed company. In Nepal, most retail participation is through NEPSE-listed shares and IPO/FPO subscriptions. Stock returns can be attractive over long periods, but prices can be volatile in the short term.\n\nPros include liquidity and high upside potential. Risks include market corrections, concentration in a few sectors, and behavioral mistakes like panic buying/selling. Stocks generally suit investors with long time horizons, stable cash flow, and tolerance for fluctuations. A worst-case scenario is a prolonged market downturn where portfolio values stay depressed for years.',
      },
      {
        title: 'Mutual Funds: Professional Diversification for Beginners',
        category: 'Mutual Fund',
        risk_icon: 'medium',
        image: '/images/education/mutual-funds.jpg',
        content:
          'Mutual funds pool money from many investors and deploy it across diversified assets managed by professionals. In Nepal, open-ended and close-ended schemes can help investors access diversified portfolios without selecting each security themselves.\n\nBenefits include diversification and disciplined investing via periodic contributions. Risks include market risk, fund manager underperformance, and expense impacts over time. Mutual funds suit investors seeking balance between growth and convenience. Worst-case scenarios include broad market drawdowns where NAV declines along with equities or debt stress in adverse conditions.',
      },
      {
        title: 'Bonds and Debentures: Stable Income Instruments',
        category: 'Bond',
        risk_icon: 'low',
        image: '/images/education/bonds.jpg',
        content:
          'Bonds and debentures are fixed-income instruments where issuers borrow money and pay periodic interest. In Nepal, government and corporate debt instruments can provide relatively predictable cash flow compared to equities.\n\nPros include lower volatility and periodic income. Risks include issuer credit risk, inflation reducing real returns, and lower liquidity for certain issues. These instruments suit conservative investors, retirees, or allocation for capital preservation. Worst-case scenarios include issuer default or inability to exit at fair prices before maturity.',
      },
      {
        title: 'Fixed Deposits (FD): Capital Protection with Predictability',
        category: 'Fixed Deposit',
        risk_icon: 'low',
        image: '/images/education/fixed-deposit.jpg',
        content:
          'Fixed Deposits are bank products where a lump sum is deposited for a fixed tenure at pre-agreed rates. In Nepal, FDs are widely used for short- to medium-term safety-oriented savings.\n\nAdvantages are principal stability and known returns. Risks are primarily inflation erosion and reinvestment risk when rates fall after maturity. FDs are suitable for emergency reserves beyond immediate cash, near-term goals, and conservative portfolios. Worst-case outcomes are lower real purchasing power and penalty if prematurely withdrawn.',
      },
      {
        title: 'Gold as a Portfolio Hedge in Nepal',
        category: 'Gold',
        risk_icon: 'medium',
        image: '/images/education/gold.jpg',
        content:
          'Gold is traditionally viewed as a store of value and inflation hedge. Nepali investors often gain exposure through physical gold or gold-linked alternatives where available.\n\nPros include diversification benefits during macro uncertainty. Risks include no cash yield, storage/security costs for physical holdings, and cyclical price swings. Gold is generally suitable as a smaller allocation alongside growth assets rather than as a sole long-term strategy. Worst-case periods include multi-year flat or declining prices where opportunity cost rises against productive assets.',
      },
      {
        title: 'Real Estate in Nepal: Long-Term Asset with Liquidity Tradeoffs',
        category: 'Real Estate',
        risk_icon: 'medium',
        image: '/images/education/real-estate.jpg',
        content:
          'Real estate offers potential rental income and long-term appreciation, and remains culturally preferred in Nepal. However, capital requirements are high and transactions are less liquid than securities.\n\nPros include tangible ownership and leverage potential. Risks include legal/documentation complexity, location-specific demand shifts, and long sale cycles. Real estate suits long-horizon investors with sufficient capital and due diligence capability. Worst-case outcomes include prolonged illiquidity, regulatory hurdles, and poor returns from overpaying in speculative periods.',
      },
      {
        title: 'Business Investment: High Upside, High Uncertainty',
        category: 'Business',
        risk_icon: 'high',
        image: '/images/education/business.jpg',
        content:
          'Investing in a business (your own or as a partner) can produce substantial wealth if operations scale effectively. In Nepal, opportunities can be strong in local demand-driven sectors, but execution quality is decisive.\n\nAdvantages include direct control and potentially high returns. Risks include cash-flow volatility, operational failures, governance issues, and complete capital loss. Business investment suits experienced, hands-on investors who can absorb downside. Worst-case scenarios include sustained losses, debt stress, and business closure.',
      },
      {
        title: 'Risk and Diversification: Core Principles for Every Investor',
        category: 'General',
        risk_icon: 'medium',
        image: '/images/education/risk-diversification.jpg',
        content:
          'Risk is the uncertainty of outcomes, not just the chance of immediate loss. Diversification reduces concentration by spreading investments across asset classes, sectors, and risk levels.\n\nA diversified strategy helps smooth returns and avoids dependence on one market segment. In practice, combine stable assets (FDs, bonds) with growth assets (stocks, mutual funds) based on horizon and goals. Over-diversification can dilute conviction, but under-diversification can magnify avoidable losses.',
      },
      {
        title: 'Compound Interest Explained: Why Starting Early Wins',
        category: 'General',
        risk_icon: 'low',
        image: '/images/education/compound-interest.jpg',
        content:
          'Compound interest means returns are earned on both principal and previous returns. Over long periods, this creates accelerating growth even with modest monthly contributions.\n\nFor example, starting five years earlier can outperform larger late contributions because compounding has more time to work. Consistency is often more impactful than timing short-term market movements. Investors should prioritize regular investing and long horizons to maximize this effect.',
      },
      {
        title: 'Time Horizon and Asset Allocation: Matching Goals to Duration',
        category: 'General',
        risk_icon: 'medium',
        image: '/images/education/time-horizon.jpg',
        content:
          'Time horizon is how long you can stay invested before needing the money. Longer horizons usually permit higher allocation to growth assets because short-term volatility can be absorbed.\n\nShort-term goals should emphasize capital stability and liquidity, while long-term goals can accept measured risk for better expected returns. Rebalancing allocation as goals approach reduces drawdown risk near withdrawal dates.',
      },
      {
        title: 'Emergency Fund Best Practices Before Investing Aggressively',
        category: 'General',
        risk_icon: 'low',
        image: '/images/education/emergency-fund.jpg',
        content:
          'An emergency fund is a readily accessible reserve for unexpected expenses such as medical, job loss, or urgent repairs. A common target is 3 to 6 months of essential expenses, held in low-risk liquid options.\n\nThis buffer prevents forced selling of long-term investments during market declines. Build and protect this reserve before increasing exposure to high-volatility assets. Investors with irregular income may choose a larger buffer for resilience.',
      },
    ];

    await this.educationArticleRepository.save(articles);
  }
}
