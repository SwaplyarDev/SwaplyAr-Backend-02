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
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment
    const platformId = dto.paymentPlatform?.paymentPlatformId;

    if (!platformId) {
      throw new NotFoundException('Payment Platform ID is required');
    }

    const platform = await this.platformsRepo.findOneByOrFail({
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      paymentPlatformId: platformId,
    });

    // 2. Construir el provider
    const provider = this.providersRepo.create({
      ...dto,
      paymentPlatform: platform,
    });

    // 3. Guardar
    return this.providersRepo.save(provider);
  }

  async update(id: string, dto: UpdatePaymentProvidersDto): Promise<PaymentProviders> {
    const provider = await this.findOne(id);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (dto.paymentPlatform?.code) {
      const platform = await this.platformsRepo.findOne({
        where: {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment
          code: dto.paymentPlatform.code,
        },
      });

      if (!platform) throw new NotFoundException('Payment platform not found');
      provider.paymentPlatform = platform;
    }

    Object.assign(provider, dto);

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
