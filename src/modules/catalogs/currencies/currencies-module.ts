import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Currency } from './currencies.entity';
import { CurrenciesService } from './currencies-service';
import { CurrenciesController } from './currencies-controller';
import { Countries } from '../countries/countries.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Currency, Countries])],
  controllers: [CurrenciesController],
  providers: [CurrenciesService],
  exports: [CurrenciesService, TypeOrmModule],
})
export class CurrenciesModule {}
