import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CryptoAccounts } from './crypto-accounts.entity';
import { CreateCryptoAccountDto } from './dto/create-crypto-accounts.dto';
import { UpdateCryptoAccountDto } from './dto/update-crypto-accounts.dto';
import { User } from '../../../users/entities/user.entity';
import { PaymentProviders } from '../../entities/payment-providers.entity';
import { CryptoNetworks } from '../../../catalogs/crypto-networks/crypto-networks.entity';
import { CryptoAccountFilterDto } from './dto/crypto-accounts-filter.dto';
import { Currency } from 'src/modules/catalogs/currencies/currencies.entity';

@Injectable()
export class CryptoAccountsService {
  constructor(
    @InjectRepository(CryptoAccounts)
    private readonly cryptoAccountsRepository: Repository<CryptoAccounts>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(PaymentProviders)
    private readonly paymentProvidersRepository: Repository<PaymentProviders>,
    @InjectRepository(CryptoNetworks)
    private readonly cryptoNetworksRepository: Repository<CryptoNetworks>,
    @InjectRepository(Currency)
    private readonly currencyRepository: Repository<Currency>,
  ) {}

  async create(
    createCryptoAccountDto: CreateCryptoAccountDto,
    userId: string,
  ): Promise<CryptoAccounts> {
    const {
      paymentProviderId,
      cryptoNetworkId,
      userId: dtoUserId,
      ...cryptoAccountData
    } = createCryptoAccountDto;

    // Verify user exists
    const targetUserId = dtoUserId || userId;
    const user = await this.userRepository.findOne({ where: { id: targetUserId } });
    if (!user) {
      throw new NotFoundException(`User with ID ${targetUserId} not found`);
    }

    // Verify payment provider exists
    const paymentProvider = await this.paymentProvidersRepository.findOne({
      where: { paymentProviderId },
    });
    if (!paymentProvider) {
      throw new NotFoundException(`Payment Provider with ID ${paymentProviderId} not found`);
    }

    // Verify crypto network exists
    const cryptoNetwork = await this.cryptoNetworksRepository.findOne({
      where: { cryptoNetworkId },
    });
    if (!cryptoNetwork) {
      throw new NotFoundException(`Crypto Network with ID ${cryptoNetworkId} not found`);
    }

    // Validate currency if provided
    let currency: Currency | undefined;
    if (createCryptoAccountDto.currencyId) {
      const foundCurrency = await this.currencyRepository.findOne({
        where: { currencyId: createCryptoAccountDto.currencyId }
      });
      if (!foundCurrency) {
        throw new NotFoundException(`Currency with ID ${createCryptoAccountDto.currencyId} not found`);
      }
      currency = foundCurrency;

      // Check if payment provider supports this currency using direct SQL query
      const supportedCurrency = await this.paymentProvidersRepository.query(
        `SELECT c.code, c.name FROM provider_currencies pc 
         JOIN currencies c ON pc.currency_id = c.currency_id 
         WHERE pc.provider_id = $1 AND pc.currency_id = $2`,
        [paymentProviderId, createCryptoAccountDto.currencyId]
      );
      
      if (!supportedCurrency || supportedCurrency.length === 0) {
        // Get all supported currencies for error message
        const allSupported = await this.paymentProvidersRepository.query(
          `SELECT c.code FROM provider_currencies pc 
           JOIN currencies c ON pc.currency_id = c.currency_id 
           WHERE pc.provider_id = $1`,
          [paymentProviderId]
        );
        
        const supportedCodes = allSupported.length > 0 
          ? allSupported.map((c: any) => c.code).join(', ')
          : 'none';
          
        throw new BadRequestException(
          `Payment Provider '${paymentProvider.name}' does not support currency '${currency.code}'. Supported currencies: ${supportedCodes}`
        );
      }
    }

    const cryptoAccount = this.cryptoAccountsRepository.create({
      ...cryptoAccountData,
      user,
      paymentProvider,
      cryptoNetwork,
      ...(currency && { currency }),
      createdBy: user,
    });

    return this.cryptoAccountsRepository.save(cryptoAccount);
  }

  async findAll(filters: CryptoAccountFilterDto) {
    const { paymentProviderCode } = filters;

    const query = this.cryptoAccountsRepository
      .createQueryBuilder('account')
      .leftJoinAndSelect('account.user', 'user')
      .leftJoinAndSelect('account.paymentProvider', 'provider');

    if (paymentProviderCode) {
      query.andWhere('provider.code = :paymentProviderCode', {
        paymentProviderCode,
      });
    }
    return await query.getMany();
  }

  async findByUserId(userId: string): Promise<CryptoAccounts[]> {
    return this.cryptoAccountsRepository.find({
      where: { user: { id: userId } },
      relations: ['user', 'paymentProvider', 'cryptoNetwork', 'currency'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<CryptoAccounts> {
    const cryptoAccount = await this.cryptoAccountsRepository.findOne({
      where: { cryptoAccountId: id },
      relations: ['user', 'paymentProvider', 'cryptoNetwork', 'currency'],
    });

    if (!cryptoAccount) {
      throw new NotFoundException(`Crypto Account with ID ${id} not found`);
    }

    return cryptoAccount;
  }

  async update(
    id: string,
    updateCryptoAccountDto: UpdateCryptoAccountDto,
  ): Promise<CryptoAccounts> {
    const cryptoAccount = await this.findOne(id);

    if (updateCryptoAccountDto.currencyId) {
      const currency = await this.currencyRepository.findOne({
        where: { currencyId: updateCryptoAccountDto.currencyId }
      });
      if (!currency) {
        throw new NotFoundException(`Currency with ID ${updateCryptoAccountDto.currencyId} not found`);
      }

      // Check if payment provider supports this currency using direct SQL query
      const supportedCurrency = await this.paymentProvidersRepository.query(
        `SELECT c.code, c.name FROM provider_currencies pc 
         JOIN currencies c ON pc.currency_id = c.currency_id 
         WHERE pc.provider_id = $1 AND pc.currency_id = $2`,
        [cryptoAccount.paymentProvider.paymentProviderId, updateCryptoAccountDto.currencyId]
      );
      
      if (!supportedCurrency || supportedCurrency.length === 0) {
        // Get all supported currencies for error message
        const allSupported = await this.paymentProvidersRepository.query(
          `SELECT c.code FROM provider_currencies pc 
           JOIN currencies c ON pc.currency_id = c.currency_id 
           WHERE pc.provider_id = $1`,
          [cryptoAccount.paymentProvider.paymentProviderId]
        );
        
        const supportedCodes = allSupported.length > 0 
          ? allSupported.map((c: any) => c.code).join(', ')
          : 'none';
          
        throw new BadRequestException(
          `Payment Provider '${cryptoAccount.paymentProvider.name}' does not support currency '${currency.code}'. Supported currencies: ${supportedCodes}`
        );
      }
    }

    Object.assign(cryptoAccount, updateCryptoAccountDto);

    return this.cryptoAccountsRepository.save(cryptoAccount);
  }
  async inactivate(id: string): Promise<CryptoAccounts> {
    const cryptoAccount = await this.findOne(id);
    cryptoAccount.isActive = false;
    return this.cryptoAccountsRepository.save(cryptoAccount);
  }

  async remove(id: string): Promise<void> {
    const cryptoAccount = await this.findOne(id);
    await this.cryptoAccountsRepository.remove(cryptoAccount);
  }
}
