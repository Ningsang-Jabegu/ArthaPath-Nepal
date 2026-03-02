import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User } from '../entities/user.entity';
import { UserPreference } from '../entities/user-preference.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, UserPreference])],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
