import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VirtualBankAccounts } from './virtual-bank-accounts.entity';
import { CreateVirtualBankAccountDto } from './dto/create-virtual-bank-accounts.dto';
import { UpdateVirtualBankAccountDto } from './dto/update-virtual-bank-accounts.dto';
import { User } from '../../../users/entities/user.entity';
import { PaymentProviders } from '../../entities/payment-providers.entity';
import { VirtualBankAccountFilterDto } from './dto/virtual-bank-accounts-filter.dto';

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

  async findAll(filters: VirtualBankAccountFilterDto) {
    const { paymentProviderCode, currency } = filters;

    const query = this.virtualBankAccountsRepository
      .createQueryBuilder('account')
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

  // async update(
  //   id: string,
  //   updateVirtualBankAccountDto: UpdateVirtualBankAccountDto,
  //   user: { userId: string; roleCode: string },
  // ): Promise<VirtualBankAccounts> {
  //   const account = await this.virtualBankAccountsRepository.findOne({
  //     where: { virtualBankAccountId: id },
  //     relations: ['user', 'createdBy', 'paymentProvider'],
  //   });

  //   if (!account) {
  //     throw new NotFoundException(`Virtual Bank Account with ID ${id} not found`);
  //   }

  //   // REGLA: USER SOLO PUEDE EDITAR SUS PROPIAS CUENTAS
  //   if (user.roleCode === 'user') {
  //     if (account.user.id !== user.userId) {
  //       throw new ForbiddenException('Users can only edit their own virtual bank accounts');
  //     }
  //   }

  //   // REGLA: ADMIN PUEDE EDITAR CUENTAS CREADAS POR OTROS ADMIN
  //   if (user.roleCode === 'admin') {
  //     if (account.createdBy.roleCode !== 'admin') {
  //       throw new ForbiddenException(
  //         'Admins can only edit virtual bank accounts created by other admins',
  //       );
  //     }
  //   }
  //   // Si esta permitido, aplica los cambios
  //   Object.assign(account, updateVirtualBankAccountDto);

  //   return this.virtualBankAccountsRepository.save(account);
  // }

  async update(
    id: string,
    updateVirtualBankAccountDto: UpdateVirtualBankAccountDto,
    userId: string,
  ): Promise<VirtualBankAccounts> {
    const virtualBankAccount = await this.findOne(id);

    // Obtener el usuario autenticado para verificar su rol
    const currentUser = await this.userRepository.findOne({ where: { id: userId } });
    if (!currentUser) {
      throw new NotFoundException('Current user not found');
    }

    // Verificar permisos según el rol
    if (currentUser.roleCode === 'user') {
      // Los usuarios solo pueden editar sus propias cuentas
      if (virtualBankAccount.user.id !== userId) {
        throw new ForbiddenException('You can only edit your own bank accounts');
      }
    } else if (currentUser.roleCode === 'admin') {
      // Los admins solo pueden editar cuentas creadas por otros admins
      if (virtualBankAccount.user.roleCode !== 'admin') {
        throw new ForbiddenException('Admins can only edit bank accounts created by other admins');
      }
    }

    Object.assign(virtualBankAccount, updateVirtualBankAccountDto);

    return this.virtualBankAccountsRepository.save(virtualBankAccount);
  }

  async inactivate(id: string): Promise<VirtualBankAccounts> {
    const virtualBankAccount = await this.findOne(id);
    virtualBankAccount.isActive = false;
    return this.virtualBankAccountsRepository.save(virtualBankAccount);
  }

  async remove(id: string): Promise<void> {
    const virtualBankAccount = await this.findOne(id);
    await this.virtualBankAccountsRepository.remove(virtualBankAccount);
  }
}
