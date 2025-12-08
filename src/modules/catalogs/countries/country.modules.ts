import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CountriesController } from './countries.controller';
import { CountriesService } from './country.service';
import { Countries } from './countries.entity';
import { Currency } from '../currencies/currencies.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Countries, Currency])],
  controllers: [CountriesController],
  providers: [CountriesService],
  exports: [CountriesService],
})
export class CountriesModule {}
