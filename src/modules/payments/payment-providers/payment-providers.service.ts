import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaymentProviders } from './payment-providers.entity';
import { CreatePaymentProvidersDto } from './dto/create-payment-providers.dto';
import { UpdatePaymentProvidersDto } from './dto/update-payment-providers.dto';
import { PaymentPlatforms } from '../payment-platforms/payment-platforms.entity';
import { Countries } from 'src/modules/catalogs/countries/countries.entity';
import { BankAccounts } from '../accounts/bank-accounts/bank-accounts.entity';
import { VirtualBankAccounts } from '../accounts/virtual-bank-accounts/virtual-bank-accounts.entity';
import { CryptoAccounts } from '../accounts/crypto-accounts/crypto-accounts.entity';

@Injectable()
export class PaymentProvidersService {
  constructor(
    @InjectRepository(PaymentProviders)
    private readonly providersRepo: Repository<PaymentProviders>,

    @InjectRepository(PaymentPlatforms)
    private readonly platformsRepo: Repository<PaymentPlatforms>,

    @InjectRepository(Countries)
    private readonly countriesRepository: Repository<Countries>,

    @InjectRepository(BankAccounts)
    private readonly bankRepo: Repository<BankAccounts>,

    @InjectRepository(VirtualBankAccounts)
    private readonly virtualRepo: Repository<VirtualBankAccounts>,

    @InjectRepository(CryptoAccounts)
    private readonly cryptoRepo: Repository<CryptoAccounts>,
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
    const { paymentPlatformId, countryId, ...providerData } = dto;

    const platform = await this.platformsRepo.findOneBy({
      paymentPlatformId,
    });

    if (!platform) {
      throw new NotFoundException(`Payment Platform with ID ${paymentPlatformId} not found`);
    }

    // Validar país (obligatorio)
    const country = await this.countriesRepository.findOne({
      where: { id: countryId },
    });
    if (!country) {
      throw new NotFoundException(`Country with ID ${countryId} not found`);
    }

    const provider = this.providersRepo.create({
      ...providerData,
      paymentPlatform: platform,
      country,
    });

    try {
      return await this.providersRepo.save(provider);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException(`El código '${dto.code}' ya existe`);
      }
      throw error;
    }
  }

  async update(id: string, dto: UpdatePaymentProvidersDto): Promise<PaymentProviders> {
    const provider = await this.findOne(id);
    const { paymentPlatformId, countryId, ...updateData } = dto;

    if (paymentPlatformId) {
      const platform = await this.platformsRepo.findOneBy({
        paymentPlatformId,
      });

      if (!platform) {
        throw new NotFoundException(`Payment Platform with ID ${paymentPlatformId} not found`);
      }
      provider.paymentPlatform = platform;
    }

    // Validar país si se proporciona en la actualización
    if (countryId) {
      const country = await this.countriesRepository.findOne({
        where: { id: countryId },
      });
      if (!country) {
        throw new NotFoundException(`Country with ID ${countryId} not found`);
      }
      provider.country = country;
    }

    Object.assign(provider, updateData);

    return this.providersRepo.save(provider);
  }

  async inactivate(id: string): Promise<PaymentProviders> {
    const provider = await this.providersRepo.findOne({
      where: { paymentProviderId: id },
      relations: ['bankAccounts', 'virtualBankAccounts', 'cryptoAccounts'],
    });

    if (!provider) {
      throw new NotFoundException(`Payment provider with ID ${id} not found`);
    }

    // Inactivar bank accounts
    if (provider.bankAccounts?.length) {
      for (const acc of provider.bankAccounts) {
        acc.isActive = false;
      }
      await this.bankRepo.save(provider.bankAccounts);
    }

    // Inactivar virtual bank accounts
    if (provider.virtualBankAccounts?.length) {
      for (const acc of provider.virtualBankAccounts) {
        acc.isActive = false;
      }
      await this.virtualRepo.save(provider.virtualBankAccounts);
    }

    // Inactivar crypto accounts
    if (provider.cryptoAccounts?.length) {
      for (const acc of provider.cryptoAccounts) {
        acc.isActive = false;
      }
      await this.cryptoRepo.save(provider.cryptoAccounts);
    }

    // Finalmente, inactivar el provider
    provider.isActive = false;
    return this.providersRepo.save(provider);
  }

  async remove(id: string): Promise<void> {
    const provider = await this.findOne(id);
    await this.providersRepo.remove(provider);
  }
}
