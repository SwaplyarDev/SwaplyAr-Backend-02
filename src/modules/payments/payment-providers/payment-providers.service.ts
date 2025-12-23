import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { PaymentProviders } from './payment-providers.entity';
import { CreatePaymentProvidersDto } from './dto/create-payment-providers.dto';
import { UpdatePaymentProvidersDto } from './dto/update-payment-providers.dto';
import { PaymentPlatforms } from '../payment-platforms/payment-platforms.entity';
import { Countries } from 'src/modules/catalogs/countries/countries.entity';
import { Currency } from 'src/modules/catalogs/currencies/currencies.entity';
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

    @InjectRepository(Currency)
    private readonly currencyRepo: Repository<Currency>,

    @InjectRepository(BankAccounts)
    private readonly bankRepo: Repository<BankAccounts>,

    @InjectRepository(VirtualBankAccounts)
    private readonly virtualRepo: Repository<VirtualBankAccounts>,

    @InjectRepository(CryptoAccounts)
    private readonly cryptoRepo: Repository<CryptoAccounts>,
  ) {}

  async findAll(filters?: {
    platformCode?: string;
    providerCode?: string;
    currencyCode?: string;
    countryCode?: string;
    isActive?: boolean;
  }): Promise<PaymentProviders[]> {
    // Si no hay filtros, usa el approach simple
    if (!filters || Object.keys(filters).length === 0) {
      return this.providersRepo.find({
        relations: [
          'paymentPlatform',
          'supportedCurrencies',
          'country',
          'bankAccounts',
          'bankAccounts.currency',
          'virtualBankAccounts',
          'virtualBankAccounts.currency',
          'cryptoAccounts',
          'cryptoAccounts.currency',
          'cryptoAccounts.cryptoNetwork',
        ],
        order: { createdAt: 'DESC' },
      });
    }

    // Si hay filtros, usa QueryBuilder
    const qb = this.providersRepo
      .createQueryBuilder('provider')
      .leftJoinAndSelect('provider.paymentPlatform', 'platform')
      .leftJoinAndSelect('provider.supportedCurrencies', 'currency')
      .leftJoinAndSelect('provider.bankAccounts', 'bankAccounts')
      .leftJoinAndSelect('bankAccounts.currency', 'bankAccountCurrency')
      .leftJoinAndSelect('provider.virtualBankAccounts', 'virtualBankAccounts')
      .leftJoinAndSelect('virtualBankAccounts.currency', 'virtualBankAccountCurrency')
      .leftJoinAndSelect('provider.cryptoAccounts', 'cryptoAccounts')
      .leftJoinAndSelect('cryptoAccounts.currency', 'cryptoAccountCurrency')
      .leftJoinAndSelect('cryptoAccounts.cryptoNetwork', 'cryptoNetwork')
      .orderBy('provider.createdAt', 'DESC');

    // FILTRA POR CÓDIGO DE PLATAFORMA
    if (filters?.platformCode) {
      qb.andWhere('platform.code = :platformCode', {
        platformCode: filters.platformCode,
      });
    }

    // FILTRA POR CÓDIGO DE PROVEEDOR
    if (filters?.providerCode) {
      qb.andWhere('provider.code = :providerCode', {
        providerCode: filters.providerCode,
      });
    }

    // FILTRA POR MONEDA (currencies asociadas al provider)
    if (filters?.currencyCode) {
      // Comparamos en uppercase para evitar problemas por mayúsculas/minúsculas
      qb.andWhere('currency.code = :currencyCode', {
        currencyCode: filters.currencyCode,
      });
    }

    // FILTRA POR COUNTRY CODE (usar innerJoin solo si hay filtro explícito)
    if (filters?.countryCode) {
      qb.innerJoinAndSelect('provider.country', 'country').andWhere(
        'country.code = :countryCode',
        {
          countryCode: filters.countryCode,
        },
      );
    } else {
      // Si no hay filtro de país, hacer left join para incluir país si existe
      qb.leftJoinAndSelect('provider.country', 'country');
    }

    // FILTRA POR ATRIBUTO isActive
    if (filters?.isActive === true) {
      qb.andWhere('provider.isActive = :isActive', {
        isActive: true,
      });
    } else if (filters?.isActive === false) {
      qb.andWhere('provider.isActive = :isActive', {
        isActive: false,
      });
    }

    return qb.getMany();
  }

  async findOne(id: string): Promise<PaymentProviders> {
    const provider = await this.providersRepo.findOne({
      where: { paymentProviderId: id },
      relations: [
        'paymentPlatform',
        'supportedCurrencies',
        'country',
        'bankAccounts',
        'bankAccounts.currency',
        'virtualBankAccounts',
        'virtualBankAccounts.currency',
        'cryptoAccounts',
        'cryptoAccounts.currency',
        'cryptoAccounts.cryptoNetwork',
      ],
    });

    if (!provider) throw new NotFoundException('Payment provider not found');
    return provider;
  }

  async create(dto: CreatePaymentProvidersDto) {
    const { paymentPlatformId, countryId, currencyIds, ...providerData } = dto;

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

    // Validar monedas si se proporcionan
    let currencies: Currency[] = [];
    if (currencyIds?.length) {
      currencies = await this.currencyRepo.findBy({
        currencyId: In(currencyIds),
      });

      if (currencies.length !== currencyIds.length) {
        throw new NotFoundException('One or more currencies not found');
      }
    }

    const provider = this.providersRepo.create({
      ...providerData,
      paymentPlatform: platform,
      country,
      supportedCurrencies: currencies,
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
    const { paymentPlatformId, countryId, currencyIds, ...updateData } = dto;

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

    // Aplicar cambios simples
    Object.assign(provider, updateData);

    // Si se enviaron currencyIds en el PATCH, reemplazar las monedas soportadas
    if (currencyIds?.length) {
      const currencies = await this.currencyRepo.findBy({
        currencyId: In(currencyIds),
      });

      if (currencies.length !== currencyIds.length) {
        throw new NotFoundException('One or more currencies not found');
      }

      provider.supportedCurrencies = currencies;
    }

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

    // Inactivar el provider
    provider.isActive = false;
    return this.providersRepo.save(provider);
  }

  async remove(id: string): Promise<void> {
    const provider = await this.findOne(id);
    await this.providersRepo.remove(provider);
  }

  async assignCurrencies(providerId: string, currencyIds: string[]): Promise<PaymentProviders> {
    const provider = await this.findOne(providerId);

    const newCurrencies = await this.currencyRepo.findBy({
      currencyId: In(currencyIds),
    });

    if (!newCurrencies.length) {
      throw new NotFoundException('No valid currencies found');
    }

    // Get existing currency IDs to avoid duplicates
    const existingIds = provider.supportedCurrencies?.map((c) => c.currencyId) || [];

    // Filter out currencies that are already assigned
    const currenciesToAdd = newCurrencies.filter(
      (currency) => !existingIds.includes(currency.currencyId),
    );

    if (currenciesToAdd.length === 0) {
      throw new ConflictException('All specified currencies are already assigned to this provider');
    }

    // Add new currencies to existing ones
    provider.supportedCurrencies = [...(provider.supportedCurrencies || []), ...currenciesToAdd];
    return this.providersRepo.save(provider);
  }

  async replaceCurrencies(providerId: string, currencyIds: string[]): Promise<PaymentProviders> {
    const provider = await this.findOne(providerId);

    const currencies = await this.currencyRepo.findBy({
      currencyId: In(currencyIds),
    });

    if (!currencies.length) {
      throw new NotFoundException('No valid currencies found');
    }

    // Replace all currencies
    provider.supportedCurrencies = currencies;
    return this.providersRepo.save(provider);
  }

  async removeCurrencies(providerId: string, currencyIds: string[]): Promise<PaymentProviders> {
    const provider = await this.findOne(providerId);

    if (!provider.supportedCurrencies?.length) {
      throw new NotFoundException('Provider has no currencies to remove');
    }

    // Filter out the currencies to remove
    provider.supportedCurrencies = provider.supportedCurrencies.filter(
      (currency) => !currencyIds.includes(currency.currencyId),
    );

    return this.providersRepo.save(provider);
  }
}
