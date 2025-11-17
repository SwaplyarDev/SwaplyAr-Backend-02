import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaymentPlatforms } from './payment-platforms.entity';
import { CreatePaymentPlatformDto } from './dto/create-payment-platforms.dto';

@Injectable()
export class PaymentPlatformsService {
  constructor(
    @InjectRepository(PaymentPlatforms)
    private readonly repo: Repository<PaymentPlatforms>,
  ) {}

  async findAll(): Promise<PaymentPlatforms[]> {
    return this.repo.find({
      relations: ['providers', 'financialAccounts'],
    });
  }

  async findOne(id: string): Promise<PaymentPlatforms> {
    const platform = await this.repo.findOne({
      where: { payment_platform_id: id },
      relations: ['providers', 'financialAccounts'],
    });

    if (!platform) {
      throw new NotFoundException(`PaymentPlatform ${id} not found`);
    }

    return platform;
  }

  async create(data: CreatePaymentPlatformDto): Promise<PaymentPlatforms> {
    const entity: PaymentPlatforms = this.repo.create(data);
    return this.repo.save(entity);
  }

  async update(id: string, data: any): Promise<PaymentPlatforms> {
    const platform = await this.findOne(id);
    Object.assign(platform, data);
    return this.repo.save(platform);
  }

  async delete(id: string): Promise<void> {
    const result = await this.repo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`PaymentPlatform ${id} not found`);
    }
  }
}
