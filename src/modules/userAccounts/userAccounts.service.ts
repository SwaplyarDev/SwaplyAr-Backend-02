import { Injectable, BadRequestException, Logger, NotFoundException } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserAccount } from './entities/user-account.entity';
import { FinancialAccountsService } from '@financial-accounts/financial-accounts.service';
import { CreatePaymentMethodDto } from '@financial-accounts/payment-methods/dto/create-payment-method.dto';

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
  console.log('🔹 Intentando eliminar cuenta - userId:', user.id, 'accountId:', accountId);

  const userAccount = await this.userAccountRepo.findOne({
  where: {
    accountId: accountId,
    userId: user.id,
  },
  relations: ['financialAccount'], // para traer la FinancialAccount asociada
});

  if (!userAccount) {
    console.log('❌ No se encontró la cuenta para este usuario.');
    throw new BadRequestException('Cuenta no encontrada o no pertenece al usuario');
  }

  console.log('✅ UserAccount encontrado:', userAccount);

  // Eliminar FinancialAccount asociada
  if (userAccount.financialAccount) {
    console.log('🔹 Eliminando FinancialAccount asociada:', userAccount.financialAccount.id);
    await this.financialAccountsService.deleteById(userAccount.financialAccount.id);
  } else {
    console.log('⚠️ No hay FinancialAccount asociada.');
  }

  // Eliminar UserAccount
  console.log('🔹 Eliminando UserAccount:', accountId);
  await this.userAccountRepo.delete({ accountId });

  console.log('✅ Cuenta eliminada correctamente');
  return { message: 'Cuenta eliminada correctamente' };
}

async findAllAccount(userId: string) {
  // 1️⃣ Buscar todas las cuentas del usuario con su FinancialAccount y PaymentMethod
  const accounts = await this.userAccountRepo.find({
    where: {  userId, },
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
              ? {
                  platformId: financial.paymentMethod.platformId,
                  method: financial.paymentMethod.method,
                  type: financial.paymentMethod.type,
                }
              : null,
          }
        : null,
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

  return enrichedAccounts;
}


  // filtrar cuenta de banco especifica mediante id del usuario e id del banco
  async findOneUserAccount(userId: string, AccountId?: string) {
    // Traemos todas las cuentas del usuario
   const allBanks = await this.findAllAccount(userId);

  if (!AccountId) {
    // Si no se pasa ID, devolvemos todas las cuentas
    return allBanks;
  }

  // Filtramos por accountId (UserAccount)
  const found = allBanks.find((account) => account.userAccount.accountId === AccountId);

  if (!found) {
    throw new NotFoundException('Cuenta no encontrada para este usuario');
  }

  // Devolvemos solo la cuenta encontrada
  return found;
}
}
