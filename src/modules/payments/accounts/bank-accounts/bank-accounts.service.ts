import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BankAccounts } from './bank-accounts.entity';
import { BankAccountDetails } from './bank-account-details.entity';
import { CreateBankAccountDto } from './dto/create-bank-accounts.dto';
import { UpdateBankAccountDto } from './dto/update-bank-accounts.dto';
import { User } from '../../../users/entities/user.entity';
import { PaymentProviders } from '../../entities/payment-providers.entity';
import { Countries } from '../../../catalogs/countries/countries.entity';

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

  async findAll(): Promise<BankAccounts[]> {
    return this.bankAccountsRepository.find({
      relations: ['details', 'user', 'paymentProvider'],
    });
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

  
  async update(id: string, updateBankAccountDto: UpdateBankAccountDto): Promise<BankAccounts> {
    const bankAccount = await this.findOne(id);

    Object.assign(bankAccount, updateBankAccountDto);

    return this.bankAccountsRepository.save(bankAccount);
  }

  async remove(id: string): Promise<void> {
    const bankAccount = await this.findOne(id);
    await this.bankAccountsRepository.remove(bankAccount);
  }
}
