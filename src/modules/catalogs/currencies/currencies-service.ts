import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Currency } from './currencies.entity';
import { Countries } from '../countries/countries.entity';

@Injectable()
export class CurrenciesService {
  constructor(
    @InjectRepository(Currency)
    private readonly currencyRepo: Repository<Currency>,

    @InjectRepository(Countries)
    private readonly countriesRepo: Repository<Countries>,
  ) {}

  async findAll(): Promise<Currency[]> {
    return this.currencyRepo.find({
      relations: ['countries'],
      order: { code: 'ASC' },
    });
  }

  async findOne(id: string): Promise<Currency> {
    const currency = await this.currencyRepo.findOne({
      where: { currencyId: id },
      relations: ['countries'],
    });

    if (!currency) {
      throw new NotFoundException('Currency not found');
    }

    return currency;
  }

  async create(data: Partial<Currency>): Promise<Currency> {
    const exists = await this.currencyRepo.findOne({
      where: { code: data.code },
    });

    if (exists) {
      throw new ConflictException(`Currency with code ${data.code} already exists`);
    }

    const currency = this.currencyRepo.create(data);
    return this.currencyRepo.save(currency);
  }

  async update(id: string, data: Partial<Currency>): Promise<Currency> {
    const currency = await this.findOne(id);
    Object.assign(currency, data);
    return this.currencyRepo.save(currency);
  }

  async inactivate(id: string): Promise<Currency> {
    const currency = await this.findOne(id);
    currency.isActive = false;
    return this.currencyRepo.save(currency);
  }

  // ✅ Asociar países a una moneda
  async assignCountries(currencyId: string, countryIds: string[]): Promise<Currency> {
    const currency = await this.findOne(currencyId);

    const countries = await this.countriesRepo.findByIds(countryIds);
    if (!countries.length) {
      throw new NotFoundException('No valid countries found');
    }

    currency.countries = countries;
    return this.currencyRepo.save(currency);
  }
}
