import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VirtualBankAccounts } from './virtual-bank-accounts.entity';
import { CreateVirtualBankAccountDto } from './dto/create-virtual-bank-accounts.dto';
import { UpdateVirtualBankAccountDto } from './dto/update-virtual-bank-accounts.dto';
import { User } from '../../../users/entities/user.entity';
import { PaymentProviders } from '../../payment-providers/payment-providers.entity';
import { VirtualBankAccountFilterDto } from './dto/virtual-bank-accounts-filter.dto';
import { Currency } from 'src/modules/catalogs/currencies/currencies.entity';

@Injectable()
export class VirtualBankAccountsService {
  constructor(
    @InjectRepository(VirtualBankAccounts)
    private readonly virtualBankAccountsRepository: Repository<VirtualBankAccounts>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(PaymentProviders)
    private readonly paymentProvidersRepository: Repository<PaymentProviders>,
    @InjectRepository(Currency)
    private readonly currencyRepository: Repository<Currency>,
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

    // Validate currency if provided
    let currency: Currency | undefined;
    if (createVirtualBankAccountDto.currencyId) {
      const foundCurrency = await this.currencyRepository.findOne({
        where: { currencyId: createVirtualBankAccountDto.currencyId },
      });
      if (!foundCurrency) {
        throw new NotFoundException(
          `Currency with ID ${createVirtualBankAccountDto.currencyId} not found`,
        );
      }
      currency = foundCurrency;

      // Check if payment provider supports this currency using direct SQL query
      const supportedCurrency = await this.paymentProvidersRepository.query(
        `SELECT c.code, c.name FROM provider_currencies pc 
         JOIN currencies c ON pc.currency_id = c.currency_id 
         WHERE pc.provider_id = $1 AND pc.currency_id = $2`,
        [paymentProviderId, createVirtualBankAccountDto.currencyId],
      );

      if (!supportedCurrency || supportedCurrency.length === 0) {
        // Get all supported currencies for error message
        const allSupported = await this.paymentProvidersRepository.query(
          `SELECT c.code FROM provider_currencies pc 
           JOIN currencies c ON pc.currency_id = c.currency_id 
           WHERE pc.provider_id = $1`,
          [paymentProviderId],
        );

        const supportedCodes =
          allSupported.length > 0 ? allSupported.map((c: any) => c.code).join(', ') : 'none';

        throw new BadRequestException(
          `Payment Provider '${paymentProvider.name}' does not support currency '${currency.code}'. Supported currencies: ${supportedCodes}`,
        );
      }
    }

    const virtualBankAccount = this.virtualBankAccountsRepository.create({
      ...virtualAccountData,
      user,
      paymentProvider,
      ...(currency && { currency }),
      createdBy: user,
    });

    return this.virtualBankAccountsRepository.save(virtualBankAccount);
  }

  async findAll(filters: VirtualBankAccountFilterDto) {
    const { paymentProviderCode, currency } = filters;

    const query = this.virtualBankAccountsRepository
      .createQueryBuilder('account')
      .leftJoinAndSelect('account.user', 'user')
      .leftJoinAndSelect('account.paymentProvider', 'provider')
      .leftJoinAndSelect('account.currency', 'currency');

    if (paymentProviderCode) {
      query.andWhere('provider.code = :paymentProviderCode', {
        paymentProviderCode,
      });
    }

    if (currency) {
      query.andWhere('currency.code = :currency', { currency });
    }
    return await query.getMany();
  }

  async findByUserId(userId: string): Promise<VirtualBankAccounts[]> {
    return this.virtualBankAccountsRepository.find({
      where: { user: { id: userId } },
      relations: ['user', 'paymentProvider', 'currency'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<VirtualBankAccounts> {
    const virtualBankAccount = await this.virtualBankAccountsRepository.findOne({
      where: { virtualBankAccountId: id },
      relations: ['user', 'paymentProvider', 'currency'],
    });

    if (!virtualBankAccount) {
      throw new NotFoundException(`Virtual Bank Account with ID ${id} not found`);
    }

    return virtualBankAccount;
  }

  async update(
    id: string,
    updateVirtualBankAccountDto: UpdateVirtualBankAccountDto,
    userId: string,
  ): Promise<VirtualBankAccounts> {
    const virtualBankAccount = await this.findOne(id);

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
      where: { id: virtualBankAccount.user.id },
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

    // Verificar permisos según rol
    if (isCurrentUserAdmin) {
      // Los admins solo pueden editar cuentas creadas por otros admins
      if (!isAccountOwnerAdmin) {
        throw new ForbiddenException('Admins can only edit bank accounts created by other admins');
      }
    } else {
      // Los usuarios solo pueden editar sus propias cuentas
      if (virtualBankAccount.user.id !== userId) {
        throw new ForbiddenException('You can only edit your own bank accounts');
      }
    }

    if (updateVirtualBankAccountDto.currencyId) {
      const currency = await this.currencyRepository.findOne({
        where: { currencyId: updateVirtualBankAccountDto.currencyId },
      });
      if (!currency) {
        throw new NotFoundException(
          `Currency with ID ${updateVirtualBankAccountDto.currencyId} not found`,
        );
      }

      // Check if payment provider supports this currency using direct SQL query
      const supportedCurrency = await this.paymentProvidersRepository.query(
        `SELECT c.code, c.name FROM provider_currencies pc 
         JOIN currencies c ON pc.currency_id = c.currency_id 
         WHERE pc.provider_id = $1 AND pc.currency_id = $2`,
        [
          virtualBankAccount.paymentProvider.paymentProviderId,
          updateVirtualBankAccountDto.currencyId,
        ],
      );

      if (!supportedCurrency || supportedCurrency.length === 0) {
        // Get all supported currencies for error message
        const allSupported = await this.paymentProvidersRepository.query(
          `SELECT c.code FROM provider_currencies pc 
           JOIN currencies c ON pc.currency_id = c.currency_id 
           WHERE pc.provider_id = $1`,
          [virtualBankAccount.paymentProvider.paymentProviderId],
        );

        const supportedCodes =
          allSupported.length > 0 ? allSupported.map((c: any) => c.code).join(', ') : 'none';

        throw new BadRequestException(
          `Payment Provider '${virtualBankAccount.paymentProvider.name}' does not support currency '${currency.code}'. Supported currencies: ${supportedCodes}`,
        );
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
