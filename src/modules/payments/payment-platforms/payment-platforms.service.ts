import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaymentPlatforms } from './payment-platforms.entity';
import { CreatePaymentPlatformsDto } from './dto/create-payment-platforms.dto';
import { PaymentPlatformFilterDto } from './dto/payment-platform-filter.dto';

@Injectable()
export class PaymentPlatformsService {
  constructor(
    @InjectRepository(PaymentPlatforms)
    private readonly repo: Repository<PaymentPlatforms>,
  ) {}

  async findAll(filters: PaymentPlatformFilterDto) {
    const query = this.repo
      .createQueryBuilder('platform')
      .leftJoinAndSelect('platform.providers', 'providers');

    if (filters.code) {
      query.andWhere('platform.code = :code', { code: filters.code });
    }

    // Filtrar por isActive solo si está definido explícitamente
    if (filters.isActive === true) {
      query.andWhere('platform.isActive = :isActive', { isActive: true });
    } else if (filters.isActive === false) {
      query.andWhere('platform.isActive = :isActive', { isActive: false });
    }

    query.orderBy('platform.createdAt', 'DESC');

    return query.getMany();
  }

  async findOne(id: string): Promise<PaymentPlatforms> {
    const platform = await this.repo.findOne({
      where: { paymentPlatformId: id },
      relations: ['providers', 'financialAccounts'],
    });

    if (!platform) {
      throw new NotFoundException(`PaymentPlatform ${id} not found`);
    }

    return platform;
  }

  async create(data: CreatePaymentPlatformsDto): Promise<PaymentPlatforms> {
    const existingPlatform = await this.repo.findOne({ where: { code: data.code } });
    if (existingPlatform) {
      throw new ConflictException(`PaymentPlatform with code ${data.code} already exists`);
    }
    const entity: PaymentPlatforms = this.repo.create(data);
    return this.repo.save(entity);
  }

  async update(id: string, data: any): Promise<PaymentPlatforms> {
    const platform = await this.findOne(id);
    Object.assign(platform, data);
    return this.repo.save(platform);
  }

  async inactivate(id: string): Promise<PaymentPlatforms> {
    const platform = await this.findOne(id);
    platform.isActive = false;
    return this.repo.save(platform);
  }

  async delete(id: string): Promise<void> {
    const result = await this.repo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`PaymentPlatform ${id} not found`);
    }
  }
}
