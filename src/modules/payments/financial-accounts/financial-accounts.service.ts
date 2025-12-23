import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FinancialAccounts } from './entities/financial-accounts.entity';
import { CreateFinancialAccountDto } from './dto/create-financial-accounts.dto';
import { UpdateFinancialAccountDto } from './dto/update-financial-accounts.dto';
import { User } from '../../users/entities/user.entity';
import { PaymentPlatforms } from '../payment-platforms/entities/payment-platforms.entity';

@Injectable()
export class FinancialAccountsService {
  constructor(
    @InjectRepository(FinancialAccounts)
    private readonly financialAccountsRepository: Repository<FinancialAccounts>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(PaymentPlatforms)
    private readonly paymentPlatformsRepository: Repository<PaymentPlatforms>,
  ) {}

  async create(
    createFinancialAccountDto: CreateFinancialAccountDto,
    userId: string,
  ): Promise<FinancialAccounts> {
    const {
      paymentPlatformId,
      userId: dtoUserId,
      ...financialAccountData
    } = createFinancialAccountDto;

    // Verify user exists if provided
    const targetUserId = dtoUserId || userId;
    const user = await this.userRepository.findOne({ where: { id: targetUserId } });
    if (!user) {
      throw new NotFoundException(`User with ID ${targetUserId} not found`);
    }

    // Verify payment platform exists
    const paymentPlatform = await this.paymentPlatformsRepository.findOne({
      where: { paymentPlatformId },
    });
    if (!paymentPlatform) {
      throw new NotFoundException(`Payment Platform with ID ${paymentPlatformId} not found`);
    }

    const financialAccount = this.financialAccountsRepository.create({
      ...financialAccountData,
      userId: targetUserId,
      paymentPlatform,
      createdBy: user,
    });

    return this.financialAccountsRepository.save(financialAccount);
  }

  async findAll(): Promise<FinancialAccounts[]> {
    return this.financialAccountsRepository.find({
      relations: ['paymentPlatform', 'createdBy'],
    });
  }

  async findOne(id: string): Promise<FinancialAccounts> {
    const financialAccount = await this.financialAccountsRepository.findOne({
      where: { financialAccountId: id },
      relations: ['paymentPlatform', 'createdBy'],
    });

    if (!financialAccount) {
      throw new NotFoundException(`Financial Account with ID ${id} not found`);
    }

    return financialAccount;
  }

  async update(
    id: string,
    updateFinancialAccountDto: UpdateFinancialAccountDto,
  ): Promise<FinancialAccounts> {
    const financialAccount = await this.findOne(id);

    Object.assign(financialAccount, updateFinancialAccountDto);

    return this.financialAccountsRepository.save(financialAccount);
  }

  async remove(id: string): Promise<void> {
    const financialAccount = await this.findOne(id);
    await this.financialAccountsRepository.remove(financialAccount);
  }
}
