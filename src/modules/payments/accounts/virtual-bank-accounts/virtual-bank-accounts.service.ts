import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VirtualBankAccounts } from './virtual-bank-accounts.entity';
import { CreateVirtualBankAccountDto } from './dto/create-virtual-bank-accounts.dto';
import { UpdateVirtualBankAccountDto } from './dto/update-virtual-bank-accounts.dto';
import { User } from '../../../users/entities/user.entity';
import { PaymentProviders } from '../../entities/payment-providers.entity';

@Injectable()
export class VirtualBankAccountsService {
  constructor(
    @InjectRepository(VirtualBankAccounts)
    private readonly virtualBankAccountsRepository: Repository<VirtualBankAccounts>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(PaymentProviders)
    private readonly paymentProvidersRepository: Repository<PaymentProviders>,
  ) {}

  async create(
    createVirtualBankAccountDto: CreateVirtualBankAccountDto,
    userId: string,
  ): Promise<VirtualBankAccounts> {
    const {
      paymentProviderId,
      userId: dtoUserId,
      ...virtualAccountData
    } = createVirtualBankAccountDto;

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

    const virtualBankAccount = this.virtualBankAccountsRepository.create({
      ...virtualAccountData,
      user,
      paymentProvider,
      createdBy: user,
    });

    return this.virtualBankAccountsRepository.save(virtualBankAccount);
  }

  async findAll(): Promise<VirtualBankAccounts[]> {
    return this.virtualBankAccountsRepository.find({
      relations: ['user', 'paymentProvider'],
    });
  }

  async findByUserId(userId: string): Promise<VirtualBankAccounts[]> {
    return this.virtualBankAccountsRepository.find({
      where: { user: { id: userId } },
      relations: ['user', 'paymentProvider'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<VirtualBankAccounts> {
    const virtualBankAccount = await this.virtualBankAccountsRepository.findOne({
      where: { virtualBankAccountId: id },
      relations: ['user', 'paymentProvider'],
    });

    if (!virtualBankAccount) {
      throw new NotFoundException(`Virtual Bank Account with ID ${id} not found`);
    }

    return virtualBankAccount;
  }

  async update(
    id: string,
    updateVirtualBankAccountDto: UpdateVirtualBankAccountDto,
    user: { userId: string; roleCode: string },
  ): Promise<VirtualBankAccounts> {
    const account = await this.virtualBankAccountsRepository.findOne({
      where: { virtualBankAccountId: id },
      relations: ['user', 'createdBy', 'paymentProvider'],
    });

    if (!account) {
      throw new NotFoundException(`Virtual Bank Account with ID ${id} not found`);
    }

    // REGLA: USER SOLO PUEDE EDITAR SUS PROPIAS CUENTAS
    if (user.roleCode === 'user') {
      if (account.user.id !== user.userId) {
        throw new ForbiddenException('Users can only edit their own virtual bank accounts');
      }
    }

    // REGLA: ADMIN PUEDE EDITAR CUENTAS CREADAS POR OTROS ADMIN
    if (user.roleCode === 'admin') {
      if (account.createdBy.roleCode !== 'admin') {
        throw new ForbiddenException(
          'Admins can only edit virtual bank accounts created by other admins',
        );
      }
    }
    // If allowed → apply updates
    Object.assign(account, updateVirtualBankAccountDto);

    return this.virtualBankAccountsRepository.save(account);
  }

  async remove(id: string): Promise<void> {
    const virtualBankAccount = await this.findOne(id);
    await this.virtualBankAccountsRepository.remove(virtualBankAccount);
  }
}
