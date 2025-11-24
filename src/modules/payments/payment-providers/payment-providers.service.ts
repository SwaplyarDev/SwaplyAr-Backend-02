import { Injectable, NotFoundException } from '@nestjs/common';
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
      relations: ['paymentPlatform'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<PaymentProviders> {
    const provider = await this.providersRepo.findOne({
      where: { paymentProviderId: id },
      relations: ['paymentPlatform'],
    });

    if (!provider) throw new NotFoundException('Payment provider not found');
    return provider;
  }

  async create(dto: CreatePaymentProvidersDto) {
    // 1. Obtener la platform real desde la DB
    const { paymentPlatformId, ...providerData } = dto;

    const platform = await this.platformsRepo.findOneBy({
      paymentPlatformId,
    });

    if (!platform) {
      throw new NotFoundException(`Payment Platform with ID ${paymentPlatformId} not found`);
    }

    // 2. Construir el provider
    const provider = this.providersRepo.create({
      ...providerData,
      paymentPlatform: platform,
    });

    // 3. Guardar
    return this.providersRepo.save(provider);
  }

  async update(id: string, dto: UpdatePaymentProvidersDto): Promise<PaymentProviders> {
    const provider = await this.findOne(id);
    const { paymentPlatformId, ...updateData } = dto;

    if (paymentPlatformId) {
      const platform = await this.platformsRepo.findOneBy({
        paymentPlatformId,
      });

      if (!platform) {
        throw new NotFoundException(`Payment Platform with ID ${paymentPlatformId} not found`);
      }
      provider.paymentPlatform = platform;
    }

    Object.assign(provider, updateData);

    return this.providersRepo.save(provider);
  }

  async inactivate(id: string): Promise<PaymentProviders> {
    const provider = await this.findOne(id);
    provider.isActive = false;
    return this.providersRepo.save(provider);
  }

  async remove(id: string): Promise<void> {
    const provider = await this.findOne(id);
    await this.providersRepo.remove(provider);
  }
}
