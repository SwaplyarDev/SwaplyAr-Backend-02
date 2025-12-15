import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BankAccounts } from './bank-accounts.entity';
import { BankAccountDetails } from './bank-account-details.entity';
import { CreateBankAccountDto } from './dto/create-bank-accounts.dto';
import { UpdateBankAccountDto } from './dto/update-bank-accounts.dto';
import { User } from '../../../users/entities/user.entity';
import { PaymentProviders } from '../../payment-providers/payment-providers.entity';
import { Countries } from '../../../catalogs/countries/countries.entity';
import { BankAccountFilterDto } from './dto/bank-accounts-filter.dto';
import { Currency } from 'src/modules/catalogs/currencies/currencies.entity';

@Injectable()
export class BankAccountsService {
  constructor(
    @InjectRepository(BankAccounts)
    private readonly bankAccountsRepository: Repository<BankAccounts>,
    @InjectRepository(BankAccountDetails)
    private readonly bankAccountDetailsRepository: Repository<BankAccountDetails>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(PaymentProviders)
    private readonly paymentProvidersRepository: Repository<PaymentProviders>,
    @InjectRepository(Countries)
    private readonly countriesRepository: Repository<Countries>, 
    @InjectRepository(Currency)
    private readonly currencyRepository: Repository<Currency>,
  ) { }

  async create(createBankAccountDto: CreateBankAccountDto, userId: string): Promise<BankAccounts> {
    const {
      paymentProviderId,
      countryId,
      details,
      userId: dtoUserId,
      ...bankAccountData
    } = createBankAccountDto;

    // Verify user exists (either from DTO or from auth context)
    // Verify user exists (either from DTO or from auth context)
    const targetUserId = dtoUserId || userId;
    const user = await this.userRepository.findOne({ where: { id: targetUserId } });
    if (!user) {
      throw new NotFoundException(`User with ID ${targetUserId} not found`);
    }

    // Verify payment provider exists with supported currencies
    const paymentProvider = await this.paymentProvidersRepository.findOne({
      where: { paymentProviderId },
      relations: ['supportedCurrencies'],
    });
    if (!paymentProvider) {
      throw new NotFoundException(`Payment Provider with ID ${paymentProviderId} not found`);
    }

    // Verify country exists with supported currencies
    const country = await this.countriesRepository.findOne({
      where: { id: countryId },
      relations: ['currencies'],
    });
    if (!country) {
      throw new NotFoundException(`Country with ID ${countryId} not found`);
    }

    // Validate currency if provided
    let currency: Currency | undefined;
    if (createBankAccountDto.currencyId) {
      const foundCurrency = await this.currencyRepository.findOne({
        where: { currencyId: createBankAccountDto.currencyId }
      });
      if (!foundCurrency) {
        throw new NotFoundException(`Currency with ID ${createBankAccountDto.currencyId} not found`);
      }
      currency = foundCurrency;

      // Validate that payment provider supports this currency
      const providerSupportsCurrency = paymentProvider.supportedCurrencies?.some(
        supportedCurrency => supportedCurrency.currencyId === createBankAccountDto.currencyId
      );
      
      if (!providerSupportsCurrency) {
        throw new NotFoundException(
          `Payment Provider '${paymentProvider.name}' does not support currency '${currency.code}'`
        );
      }

      // Validate that country supports this currency
      if (!country.currencies || country.currencies.length === 0) {
        throw new NotFoundException(
          `Country '${country.name}' has no supported currencies configured`
        );
      }

      const countrySupportsCurrency = country.currencies.some(
        supportedCurrency => supportedCurrency.currencyId === createBankAccountDto.currencyId
      );
      
      if (!countrySupportsCurrency) {
        throw new NotFoundException(
          `Country '${country.name}' does not support currency '${currency.code}'`
        );
      }
    }

    // Create Bank Account
    const bankAccount = this.bankAccountsRepository.create({
      ...bankAccountData,
      user,
      paymentProvider,
      country,
      ...(currency && { currency }),
      createdBy: user,
    });

    const savedBankAccount = await this.bankAccountsRepository.save(bankAccount);

    // Create Details if provided
    if (details && details.length > 0) {
      const detailsEntities = details.map((detail) =>
        this.bankAccountDetailsRepository.create({
          ...detail,
          bankAccount: savedBankAccount,
        }),
      );
      await this.bankAccountDetailsRepository.save(detailsEntities);
    }

    return this.findOne(savedBankAccount.bankAccountId);
  }

  async findAll(filters: BankAccountFilterDto) {
    const { paymentProviderCode, currency } = filters;

    const query = this.bankAccountsRepository
      .createQueryBuilder('account')
      .leftJoinAndSelect('account.details', 'details')
      .leftJoinAndSelect('account.user', 'user')
      .leftJoinAndSelect('account.paymentProvider', 'provider');

    if (paymentProviderCode) {
      query.andWhere('provider.code = :paymentProviderCode', {
        paymentProviderCode,
      });
    }

    if (currency) {
      query.leftJoinAndSelect('account.currency', 'currency')
        .andWhere('currency.code = :currency', { currency });
    }

    return await query.getMany();
  }

  async findByUser(userId: string): Promise<BankAccounts[]> {
    const accounts = await this.bankAccountsRepository.find({
      where: { user: { id: userId } },
      relations: ['details', 'user', 'paymentProvider', 'currency'],
    });
    if (!accounts || accounts.length === 0) {
      throw new NotFoundException(`No bank accounts found for user with ID ${userId}`);
    }
    return accounts;
  }

  async findOne(id: string): Promise<BankAccounts> {
    const bankAccount = await this.bankAccountsRepository.findOne({
      where: { bankAccountId: id },
      relations: ['details', 'user', 'paymentProvider', 'currency'],
    });

    if (!bankAccount) {
      throw new NotFoundException(`Bank Account with ID ${id} not found`);
    }

    return bankAccount;
  }

  async update(
    id: string,
    updateBankAccountDto: UpdateBankAccountDto,
    userId: string,
  ): Promise<BankAccounts> {
    const bankAccount = await this.findOne(id);

    // Obtener el usuario autenticado para verificar su rol
    const currentUser = await this.userRepository.findOne({ where: { id: userId } });
    if (!currentUser) {
      throw new NotFoundException('Current user not found');
    }

    // Verificar permisos según el rol
    if (currentUser.roleCode === 'user') {
      // Los usuarios solo pueden editar sus propias cuentas
      if (bankAccount.user.id !== userId) {
        throw new ForbiddenException('You can only edit your own bank accounts');
      }
    } else if (currentUser.roleCode === 'admin') {
      // Los admins solo pueden editar cuentas creadas por otros admins
      if (bankAccount.user.roleCode !== 'admin') {
        throw new ForbiddenException('Admins can only edit bank accounts created by other admins');
      }
    }

    if (updateBankAccountDto.currencyId) {
      const currency = await this.currencyRepository.findOne({
        where: { currencyId: updateBankAccountDto.currencyId }
      });
      if (!currency) {
        throw new NotFoundException(`Currency with ID ${updateBankAccountDto.currencyId} not found`);
      }

      // Validate that payment provider supports this currency
      const providerWithCurrencies = await this.paymentProvidersRepository.findOne({
        where: { paymentProviderId: bankAccount.paymentProvider.paymentProviderId },
        relations: ['supportedCurrencies'],
      });

      const providerSupportsCurrency = providerWithCurrencies?.supportedCurrencies?.some(
        supportedCurrency => supportedCurrency.currencyId === updateBankAccountDto.currencyId
      );
      
      if (!providerSupportsCurrency) {
        throw new NotFoundException(
          `Payment Provider '${bankAccount.paymentProvider.name}' does not support currency '${currency.code}'`
        );
      }

      // Validate that country supports this currency
      const countryWithCurrencies = await this.countriesRepository.findOne({
        where: { id: bankAccount.country.id },
        relations: ['currencies'],
      });

      if (!countryWithCurrencies?.currencies || countryWithCurrencies.currencies.length === 0) {
        throw new NotFoundException(
          `Country '${bankAccount.country.name}' has no supported currencies configured`
        );
      }

      const countrySupportsCurrency = countryWithCurrencies.currencies.some(
        supportedCurrency => supportedCurrency.currencyId === updateBankAccountDto.currencyId
      );
      
      if (!countrySupportsCurrency) {
        throw new NotFoundException(
          `Country '${bankAccount.country.name}' does not support currency '${currency.code}'`
        );
      }
    }

    Object.assign(bankAccount, updateBankAccountDto);

    return this.bankAccountsRepository.save(bankAccount);
  }

  async inactivate(id: string): Promise<BankAccounts> {
    const bankAccount = await this.findOne(id);
    bankAccount.isActive = false;
    return this.bankAccountsRepository.save(bankAccount);
  }

  async remove(id: string): Promise<void> {
    const bankAccount = await this.findOne(id);
    await this.bankAccountsRepository.remove(bankAccount);
  }
}
