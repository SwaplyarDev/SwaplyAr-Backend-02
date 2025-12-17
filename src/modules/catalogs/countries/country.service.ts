import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, DataSource } from 'typeorm';
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
    private dataSource: DataSource,
  ) {}

  async findAll(): Promise<Countries[]> {
    return this.countriesRepository.find({
      relations: ['currencies'],
    });
  }

  async findOne(id: string): Promise<Countries> {
    const country = await this.countriesRepository.findOne({
      where: { id },
      relations: ['currencies'],
    });
    if (!country) {
      throw new NotFoundException('País no encontrado');
    }
    return country;
  }

  async create(createDto: CreateCountryDto): Promise<Countries> {
    const { currencyIds, ...countryData } = createDto;

    // Check if country with this code already exists
    const existingCountry = await this.countriesRepository.findOne({
      where: { code: countryData.code },
    });

    if (existingCountry) {
      throw new BadRequestException(`Country with code '${countryData.code}' already exists`);
    }

    return await this.dataSource.transaction(async (manager) => {
      // Validate currencies exist
      const currencies = await manager.findBy(Currency, {
        currencyId: In(currencyIds),
      });

      if (currencies.length !== currencyIds.length) {
        throw new NotFoundException('One or more currencies not found');
      }

      // Create country
      const country = manager.create(Countries, countryData);
      const savedCountry = await manager.save(country);

      // Insert into junction table manually
      for (const currencyId of currencyIds) {
        await manager.query(
          `INSERT INTO countries_currencies (country_id, currency_id) VALUES ($1, $2)`,
          [savedCountry.id, currencyId],
        );
      }

      // Return country with currencies loaded
      const result = await manager.findOne(Countries, {
        where: { id: savedCountry.id },
        relations: ['currencies'],
      });

      if (!result) {
        throw new Error('Failed to retrieve created country');
      }

      return result;
    });
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
    return await this.dataSource.transaction(async (manager) => {
      const country = await manager.findOne(Countries, {
        where: { id: countryId },
        relations: ['currencies'],
      });
      if (!country) {
        throw new NotFoundException('País no encontrado');
      }

      const newCurrencies = await manager.findBy(Currency, { currencyId: In(currencyIds) });
      if (newCurrencies.length !== currencyIds.length) {
        throw new NotFoundException('One or more currencies not found');
      }

      // Get existing currency IDs to avoid duplicates
      const existingIds = country.currencies?.map((c) => c.currencyId) || [];

      // Filter out currencies that are already assigned
      const currenciesToAdd = currencyIds.filter((currencyId) => !existingIds.includes(currencyId));

      if (currenciesToAdd.length === 0) {
        throw new BadRequestException(
          'All specified currencies are already assigned to this country',
        );
      }

      // Insert only new relationships
      for (const currencyId of currenciesToAdd) {
        await manager.query(
          `INSERT INTO countries_currencies (country_id, currency_id) VALUES ($1, $2)`,
          [countryId, currencyId],
        );
      }

      // Return country with currencies loaded
      const result = await manager.findOne(Countries, {
        where: { id: countryId },
        relations: ['currencies'],
      });

      if (!result) {
        throw new Error('Failed to retrieve updated country');
      }

      return result;
    });
  }
}
