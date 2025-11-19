import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaymentProviders } from './payment-providers.entity';
import { CreatePaymentProvidersDto } from './dto/create-payment-providers.dto';
import { UpdatePaymentProvidersDto } from './dto/update-payment-providers.dto';
import { PaymentPlatforms } from '../payment-platforms/payment-platforms.entity';

@Injectable()
export class PaymentProvidersService {
  constructor(
    @InjectRepository(PaymentProviders)
    private readonly providersRepo: Repository<PaymentProviders>,

    @InjectRepository(PaymentPlatforms)
    private readonly platformsRepo: Repository<PaymentPlatforms>,
  ) {}

  async findAll(): Promise<PaymentProviders[]> {
    return this.providersRepo.find({
      relations: ['payment_platform'],
      order: { created_at: 'DESC' },
    });
  }

  async findOne(id: string): Promise<PaymentProviders> {
    const provider = await this.providersRepo.findOne({
      where: { payment_provider_id: id },
      relations: ['payment_platform'],
    });

    if (!provider) throw new NotFoundException('Payment provider not found');
    return provider;
  }

  async create(dto: CreatePaymentProvidersDto): Promise<PaymentProviders> {
    // verificar plataforma asociada
    const platform = await this.platformsRepo.findOne({
      where: {
        code: dto.payment_platform.code,
      },
    });

    if (!platform) {
      throw new NotFoundException('Payment platform not found');
    }

    const exists = await this.providersRepo.findOne({
      where: { code: dto.code },
    });

    if (exists) throw new ConflictException('Provider code already exists');

    const provider = this.providersRepo.create({
      ...dto,
      payment_platform: platform,
    });

    return this.providersRepo.save(provider);
  }

  async update(id: string, dto: UpdatePaymentProvidersDto): Promise<PaymentProviders> {
    const provider = await this.findOne(id);

    if (dto.payment_platform) {
      const platform = await this.platformsRepo.findOne({
        where: {
          code: dto.payment_platform.code,
        },
      });

      if (!platform) throw new NotFoundException('Payment platform not found');
      provider.payment_platform = platform;
    }

    Object.assign(provider, dto);

    return this.providersRepo.save(provider);
  }

  async inactivate(id: string): Promise<PaymentProviders> {
    const provider = await this.findOne(id);
    provider.is_active = false;
    return this.providersRepo.save(provider);
  }

  async remove(id: string): Promise<void> {
    const provider = await this.findOne(id);
    await this.providersRepo.remove(provider);
  }
}
