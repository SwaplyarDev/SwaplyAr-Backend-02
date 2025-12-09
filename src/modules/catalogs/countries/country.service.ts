import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Countries } from './countries.entity';
import { Currency } from '../currencies/currencies.entity';
import { CreateCountryDto } from './dto/create-countries.dto';
import { UpdateCountryDto } from './dto/update-countries.dto';

@Injectable()
export class CountriesService {
  constructor(
    @InjectRepository(Countries)
    private countriesRepository: Repository<Countries>,
    @InjectRepository(Currency)
    private readonly currencyRepo: Repository<Currency>,
  ) {}

  async findAll(): Promise<Countries[]> {
    return this.countriesRepository.find();
  }

  async findOne(id: string): Promise<Countries> {
    const country = await this.countriesRepository.findOne({
      where: { country_id: id },
      relations: ['currencies'],
    });
    if (!country) {
      throw new NotFoundException('País no encontrado');
    }
    return country;
  }

  async create(dto: CreateCountryDto): Promise<Countries> {
    const { currencyIds, ...countryData } = dto;

    const currencies = await this.currencyRepo.findBy({
      currencyId: In(currencyIds),
    });

    if (currencies.length !== currencyIds.length) {
      throw new BadRequestException('One or more currencies not found');
    }

    const country = this.countriesRepository.create({
      ...countryData,
      currencies,
      currency_default: countryData.currency_default ?? currencies[0].code,
    });

    return this.countriesRepository.save(country);
  }

  async update(id: string, updateDto: UpdateCountryDto): Promise<Countries> {
    await this.findOne(id);
    await this.countriesRepository.update(id, updateDto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);
    await this.countriesRepository.delete(id);
  }

  async assignCurrencies(countryId: string, currencyIds: string[]): Promise<Countries> {
    const country = await this.findOne(countryId);

    const currencies = await this.currencyRepo.findByIds(currencyIds);
    if (!currencies.length) {
      throw new NotFoundException('No valid currencies found');
    }

    country.currencies = currencies;
    return this.countriesRepository.save(country);
  }
}
