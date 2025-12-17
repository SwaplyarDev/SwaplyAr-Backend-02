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
      ...bankAccountData
    } = createBankAccountDto;

    // Verificar que el usuario existe (del contexto de autenticación)
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`Usuario con ID ${userId} no encontrado`);
    }

    // Verificar que el proveedor de pago existe Y está activo
    const paymentProvider = await this.paymentProvidersRepository.findOne({
      where: { paymentProviderId },
    });
    if (!paymentProvider) {
      throw new NotFoundException(`Proveedor de pago con ID ${paymentProviderId} no encontrado`);
    }
    if (!paymentProvider.isActive) {
      throw new ForbiddenException(`Proveedor de pago ${paymentProviderId} no está activo`);
    }

    // Verificar que el país existe
    const country = await this.countriesRepository.findOne({
      where: { country_id: countryId },
    });
    if (!country) {
      throw new NotFoundException(`País con ID ${countryId} no encontrado`);
    }

    // Crear cuenta bancaria (siempre asociada al usuario autenticado)
    const bankAccount = this.bankAccountsRepository.create({
      ...bankAccountData,
      user,
      paymentProvider,
      country,
      createdBy: user,
    });

    const savedBankAccount = await this.bankAccountsRepository.save(bankAccount);

    // Crear detalles si se proporcionan
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

    // Obtener el usuario autenticado con sus roles
    const currentUser = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['roles'],
    });
    if (!currentUser) {
      throw new NotFoundException('Current user not found');
    }

    // Obtener el propietario de la cuenta con sus roles
    const accountOwner = await this.userRepository.findOne({
      where: { id: bankAccount.user.id },
      relations: ['roles'],
    });
    if (!accountOwner) {
      throw new NotFoundException('Account owner not found');
    }

    // Verificar si el usuario tiene un rol específico
    const hasRole = (user: any, roleCode: string) => {
      return user.roles?.some((role: any) => role.code === roleCode) || false;
    };

    const isCurrentUserAdmin = hasRole(currentUser, 'admin');
    const isAccountOwnerAdmin = hasRole(accountOwner, 'admin');

    // Verificar permisos según el rol
    if (isCurrentUserAdmin) {
      // Los admins solo pueden editar cuentas creadas por otros admins
      if (!isAccountOwnerAdmin) {
        throw new ForbiddenException('Admins can only edit bank accounts created by other admins');
      }
    } else {
      // Los usuarios solo pueden editar sus propias cuentas
      if (bankAccount.user.id !== userId) {
        throw new ForbiddenException('You can only edit your own bank accounts');
      }
    }

    Object.assign(bankAccount, updateBankAccountDto);

    return this.bankAccountsRepository.save(bankAccount);
  }

  async inactivate(id: string, userId: string): Promise<BankAccounts> {
    const bankAccount = await this.findOne(id);

    // Obtener el usuario autenticado con sus roles
    const currentUser = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['roles'],
    });
    if (!currentUser) {
      throw new NotFoundException('Usuario actual no encontrado');
    }

    // Obtener el propietario de la cuenta con sus roles
    const accountOwner = await this.userRepository.findOne({
      where: { id: bankAccount.user.id },
      relations: ['roles'],
    });
    if (!accountOwner) {
      throw new NotFoundException('Propietario de la cuenta no encontrado');
    }

    // Verificar si el usuario tiene un rol específico
    const hasRole = (user: any, roleCode: string) => {
      return user.roles?.some((role: any) => role.code === roleCode) || false;
    };

    const isCurrentUserAdmin = hasRole(currentUser, 'admin');
    const isAccountOwnerAdmin = hasRole(accountOwner, 'admin');

    // Verificar permisos según el rol
    if (isCurrentUserAdmin) {
      // Los admins solo pueden inactivar cuentas creadas por otros admins
      if (!isAccountOwnerAdmin) {
        throw new ForbiddenException('Los administradores solo pueden inactivar cuentas bancarias creadas por otros administradores');
      }
    } else {
      // Los usuarios solo pueden inactivar sus propias cuentas
      if (bankAccount.user.id !== userId) {
        throw new ForbiddenException('Solo puede inactivar sus propias cuentas bancarias');
      }
    }

    bankAccount.isActive = false;
    return this.bankAccountsRepository.save(bankAccount);
  }

  async remove(id: string, userId: string): Promise<void> {
    const bankAccount = await this.findOne(id);

    // Obtener el usuario autenticado con sus roles
    const currentUser = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['roles'],
    });
    if (!currentUser) {
      throw new NotFoundException('Usuario actual no encontrado');
    }

    // Obtener el propietario de la cuenta con sus roles
    const accountOwner = await this.userRepository.findOne({
      where: { id: bankAccount.user.id },
      relations: ['roles'],
    });
    if (!accountOwner) {
      throw new NotFoundException('Propietario de la cuenta no encontrado');
    }

    // Verificar si el usuario tiene un rol específico
    const hasRole = (user: any, roleCode: string) => {
      return user.roles?.some((role: any) => role.code === roleCode) || false;
    };

    const isCurrentUserAdmin = hasRole(currentUser, 'admin');
    const isAccountOwnerAdmin = hasRole(accountOwner, 'admin');

    // Verificar permisos según el rol
    if (isCurrentUserAdmin) {
      // Los admins solo pueden eliminar cuentas creadas por otros admins
      if (!isAccountOwnerAdmin) {
        throw new ForbiddenException('Los administradores solo pueden eliminar cuentas bancarias creadas por otros administradores');
      }
    } else {
      // Los usuarios solo pueden eliminar sus propias cuentas
      if (bankAccount.user.id !== userId) {
        throw new ForbiddenException('Solo puede eliminar sus propias cuentas bancarias');
      }
    }

    await this.bankAccountsRepository.remove(bankAccount);
  }
}
