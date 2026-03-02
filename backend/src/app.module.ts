import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { User } from './entities/user.entity';
import { UserPreference } from './entities/user-preference.entity';
import { InvestmentCategory } from './entities/investment-category.entity';
import { SimulationHistory } from './entities/simulation-history.entity';
import { SimulatorModule } from './simulator/simulator.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { InvestmentCategoryModule } from './investment-category/investment-category.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000, // 60 seconds
        limit: 10, // 10 requests per minute
      },
    ]),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432', 10),
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      database: process.env.DB_DATABASE || 'arthapath_nepal',
      entities: [User, UserPreference, InvestmentCategory, SimulationHistory],
      synchronize: process.env.NODE_ENV === 'development', // Only in development!
      logging: process.env.NODE_ENV === 'development',
    }),
    AuthModule,
    UserModule,
    SimulatorModule,
    InvestmentCategoryModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
