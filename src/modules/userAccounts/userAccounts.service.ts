import { Injectable, BadRequestException, Logger, NotFoundException } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserAccount } from './entities/user-account.entity';
import { FinancialAccountsService } from '@financial-accounts/financial-accounts.service';
import { CreatePaymentMethodDto } from '@financial-accounts/payment-methods/dto/create-payment-method.dto';
import { CreateUserAccountResponseDto } from './dto/user-account-response.dto';

@Injectable()
export class AccountsService {
  private readonly logger = new Logger(AccountsService.name);

  constructor(
    @InjectRepository(UserAccount)
    private readonly userAccountRepo: Repository<UserAccount>,
    private readonly financialAccountsService: FinancialAccountsService, // servicio que crea FinancialAccount + PaymentMethod
  ) {}

  async createUserAccountWithFinancial(
    userId: string,
    createPaymentMethodDto: CreatePaymentMethodDto,
    accountData: { accountName?: string; firstName?: string; lastName?: string },
  ) {
    try {
      const userAccount = this.userAccountRepo.create({
        accountName: accountData.accountName,
        userId,
        status: true,
      });

      const savedUserAccount = await this.userAccountRepo.save(userAccount);

      const financialAccount = await this.financialAccountsService.createSingleFinancialAccount(
        createPaymentMethodDto,
        { firstName: accountData.firstName, lastName: accountData.lastName },
      );

      savedUserAccount.financialAccount = financialAccount;
      await this.userAccountRepo.save(savedUserAccount);

      return savedUserAccount;
    } catch (err) {
      throw new BadRequestException(`Error creando UserAccount: ${err.message}`);
    }
  }

  async deleteUserAccount(user: any, accountId: string) {
    const userAccount = await this.userAccountRepo.findOne({
      where: {
        accountId: accountId,
        userId: user.id,
      },
      relations: ['financialAccount'], // para traer la FinancialAccount asociada
    });

    if (!userAccount) {
      throw new BadRequestException('Cuenta no encontrada o no pertenece al usuario');
    }

    // Eliminar FinancialAccount asociada
    if (userAccount.financialAccount) {
      await this.financialAccountsService.deleteById(userAccount.financialAccount.id);
    }

    // Eliminar UserAccount
    await this.userAccountRepo.delete({ accountId });

    return { message: 'Cuenta eliminada correctamente' };
  }

  async findAllAccount(userId: string): Promise<CreateUserAccountResponseDto[]> {
    // 1️⃣ Buscar todas las cuentas del usuario con su FinancialAccount y PaymentMethod
    const accounts = await this.userAccountRepo.find({
      where: { userId },
      relations: ['financialAccount', 'financialAccount.paymentMethod'],
    });

    if (!accounts || accounts.length === 0) {
      throw new NotFoundException('No se encontraron cuentas registradas');
    }

    // 2️⃣ Mapear los datos
    const enrichedAccounts = accounts.map((account) => {
      const financial = account.financialAccount;

      return {
        accountName: account.accountName,
        financialAccount: financial
          ? {
              id: financial.id,
              firstName: financial.firstName,
              lastName: financial.lastName,
              paymentMethod: financial.paymentMethod
                ? Object.fromEntries(
                    Object.entries(financial.paymentMethod).filter(
                      ([key, value]) => key !== 'type' || value != null,
                    ),
                  )
                : undefined,
            }
          : undefined,
        userAccount: {
          accountId: account.accountId,
          accountName: account.accountName,
          createdAt: account.createdAt,
          updatedAt: account.updatedAt,
          status: account.status,
          userId: account.userId,
        },
      };
    });

    return enrichedAccounts as CreateUserAccountResponseDto[];
  }

  async findAllUserAccounts(userId: string): Promise<CreateUserAccountResponseDto[]> {
    const allBanks = await this.findAllAccount(userId);
    return allBanks;
  }

  async findOneUserAccount(
    userId: string,
    accountId: string,
  ): Promise<CreateUserAccountResponseDto> {
    const allBanks = await this.findAllAccount(userId);

    const found = allBanks.find((acc) => acc.userAccount.accountId === accountId);
    if (!found) throw new NotFoundException('Cuenta no encontrada para este usuario');

    return found;
  }
}
