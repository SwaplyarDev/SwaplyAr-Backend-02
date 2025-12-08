import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BankAccounts } from './bank-accounts.entity';
import { BankAccountDetails } from './bank-account-details.entity';
import { CreateBankAccountDto } from './dto/create-bank-accounts.dto';
import { UpdateBankAccountDto } from './dto/update-bank-accounts.dto';
import { User } from '../../../users/entities/user.entity';
import { PaymentProviders } from '../../entities/payment-providers.entity';
import { Countries } from '../../../catalogs/countries/countries.entity';
import { BankAccountFilterDto } from './dto/bank-accounts-filter.dto';

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
  ) {}

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

    // Verify payment provider exists
    const paymentProvider = await this.paymentProvidersRepository.findOne({
      where: { paymentProviderId },
    });
    if (!paymentProvider) {
      throw new NotFoundException(`Payment Provider with ID ${paymentProviderId} not found`);
    }

    // Verify country exists
    const country = await this.countriesRepository.findOne({
      where: { country_id: countryId },
    });
    if (!country) {
      throw new NotFoundException(`Country with ID ${countryId} not found`);
    }

    // Create Bank Account
    const bankAccount = this.bankAccountsRepository.create({
      ...bankAccountData,
      user,
      paymentProvider,
      country,
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
      query.andWhere('account.currency = :currency', { currency });
    }

    return await query.getMany();
  }

  async findByUser(userId: string): Promise<BankAccounts[]> {
    const accounts = await this.bankAccountsRepository.find({
      where: { user: { id: userId } },
      relations: ['details', 'user', 'paymentProvider'],
    });
    if (!accounts || accounts.length === 0) {
      throw new NotFoundException(`No bank accounts found for user with ID ${userId}`);
    }
    return accounts;
  }

  async findOne(id: string): Promise<BankAccounts> {
    const bankAccount = await this.bankAccountsRepository.findOne({
      where: { bankAccountId: id },
      relations: ['details', 'user', 'paymentProvider'],
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
