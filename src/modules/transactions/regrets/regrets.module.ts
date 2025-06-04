import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Regret } from './entities/regrets.entity';
import { RegretsService } from './regrets.service';
import { RegretsController } from './regrets.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Regret])],
  controllers: [RegretsController],
  providers: [RegretsService],
  exports: [RegretsService],
})
export class RegretsModule {} 