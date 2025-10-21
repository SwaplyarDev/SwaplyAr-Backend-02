import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DynamicCommission } from './entities/dynamicCommissions.entity';
import { DynamicCommissionsController } from './controllers/dynamicCommissions.controller';
import { DynamicCommissionsService } from './services/dynamicCommissions.service';
import { AuthModule } from '@auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([DynamicCommission]), AuthModule],
  controllers: [DynamicCommissionsController],
  providers: [DynamicCommissionsService],
  exports: [DynamicCommissionsService],
})
export class DynamicCommissionsModule {}
