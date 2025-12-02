import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Roles } from './entities/roles.entity';
import { RolesController } from './roles.controller';
import { RolesService } from './roles.service';
import { User } from '../users/entities/user.entity';
import { UserProfile } from '../users/entities/user-profile.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Roles, User, UserProfile])],
  controllers: [RolesController],
  providers: [RolesService],
  exports: [RolesService],
})
export class RolesModule {}
