import {
  Injectable,
  BadRequestException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { validateFields } from './helpers/validate-fields.helper';
import { validateUserAccount } from './helpers/validate-user-account.helper';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserAccount } from './entities/user-account.entity';
import { UserBank } from './entities/user-bank.entity';
import { UserVirtualBank } from './entities/user-virtual-bank.entity';
import { UserReceiverCrypto } from './entities/user-receiver-crypto.entity';
import { UserPix } from './entities/user-pix.entity';
import { Platform } from 'src/enum/platform.enum';
import { UserAccValuesDto } from './dto/create-bank-account.dto';

@Injectable()
export class AccountsService {
  private readonly logger = new Logger(AccountsService.name);

  constructor(
    @InjectRepository(UserAccount)
    private readonly userAccountRepo: Repository<UserAccount>,
    @InjectRepository(UserBank)
    private readonly bankAccountRepo: Repository<UserBank>,
    @InjectRepository(UserVirtualBank)
    private readonly virtualBankRepo: Repository<UserVirtualBank>,
    @InjectRepository(UserReceiverCrypto)
    private readonly receiverCryptoRepo: Repository<UserReceiverCrypto>,
    @InjectRepository(UserPix)
    private readonly pixRepo: Repository<UserPix>,
  ) {}

  async createUserBan(
    accountType: Platform,
    userAccValues: UserAccValuesDto,
    userId: string,
  ) {
    try {
      const userAccount = this.userAccountRepo.create({
        accountType: userAccValues.accountType,
        accountName: userAccValues.accountName,
        userId,
        status: true,
      });
      const savedUserAccount = await this.userAccountRepo.save(userAccount);
      // busca un tipo de cuenta para poder registrarla en una tabla
      // ejemplo: si es igual a virtual_bank la busca en la tabla y crea una nueva
      let specificAccount;

      // crea una cuenta de banco
      if (accountType === Platform.Bank) {
        specificAccount = this.bankAccountRepo.create({
          currency: userAccValues.currency,
          bankName: userAccValues.bankName,
          send_method_key: userAccValues.send_method_key,
          send_method_value: userAccValues.send_method_value,
          document_type: userAccValues.document_type,
          document_value: userAccValues.document_value,
          userAccount: savedUserAccount,
        });

        await this.bankAccountRepo.save(specificAccount);

        //crea una cuenta virtual
      } else if (accountType === Platform.Virtual_Bank) {
        specificAccount = this.virtualBankRepo.create({
          accountType: userAccValues.accountType,
          currency: userAccValues.currency,
          accountId: savedUserAccount.account_id,
          type: userAccValues.type,
          email: userAccValues.email,
          firstName: userAccValues.firstName,
          lastName: userAccValues.lastName,
          userAccount: savedUserAccount,
        });
        await this.virtualBankRepo.save(specificAccount);

        // crea una cuenta de crypto
      } else if (accountType === Platform.Receiver_Crypto) {
        specificAccount = this.receiverCryptoRepo.create({
          currency: userAccValues.currency,
          network: userAccValues.network,
          wallet: userAccValues.wallet,
          userAccount: savedUserAccount,
        });
        await this.receiverCryptoRepo.save(specificAccount);

        // crea una cuenta de pix
      } else if (accountType === Platform.Pix) {
        specificAccount = this.pixRepo.create({
          userAccount: savedUserAccount,
          cpf: userAccValues.cpf,
          pix_value: userAccValues.pix_value,
          pix_key: userAccValues.pix_key,
        });

        await this.pixRepo.save(specificAccount);
      }

      return {
        details: specificAccount,
      };
    } catch (err) {
      this.logger.error('Error creating bank:', err);
      throw new BadRequestException('Error creating bank account');
    }
  }

  async deleteBankAccount(user: any, bankAccountId: string) {
    // Busca la cuenta principal del usuario
    const userAccount = await this.userAccountRepo.findOne({
      where: { account_id: bankAccountId, userId: user.id },
    });

    if (!userAccount) {
      throw new BadRequestException(
        'Cuenta no encontrada o no pertenece al usuario',
      );
    }

    // Elimina solo en la tabla específica según el tipo de cuenta
    switch (userAccount.accountType) {
      case Platform.Bank:
        await this.bankAccountRepo.delete({ accountId: bankAccountId });
        break;
      case Platform.Pix:
        await this.pixRepo.delete({ accountId: bankAccountId });
        break;
      case Platform.Virtual_Bank:
        await this.virtualBankRepo.delete({ accountId: bankAccountId });
        break;
      case Platform.Receiver_Crypto:
        await this.receiverCryptoRepo.delete({
          accountId: bankAccountId,
        });
        break;
      default:
        throw new BadRequestException('Tipo de cuenta no soportado');
    }

    // Elimina la cuenta principal
    await this.userAccountRepo.delete({ account_id: bankAccountId });

    return { message: 'Cuenta eliminada correctamente' };
  }

  async findAllBanks(user: any) {
    // Buscar todas las cuentas del usuario
    const accounts = await this.userAccountRepo.find({
      where: { userId: user },
    });

    const enrichedAccounts = await Promise.all(
      accounts.map(async (account) => {
        const typeId = account.accountType as Platform;
        const { account_id } = account;

        let details: any[] = [];

        // Buscar los detalles según el tipo de cuenta
        switch (typeId) {
          case Platform.Bank:
            details = await this.bankAccountRepo.find({
              where: { userAccount: { account_id } },
              relations: ['userAccount'],
            });
            break;

          case Platform.Pix:
            details = await this.pixRepo.find({
              where: { userAccount: { account_id } },
              relations: ['userAccount'],
            });
            break;

          case Platform.Virtual_Bank:
            details = await this.virtualBankRepo.find({
              where: { userAccount: { account_id } },
              relations: ['userAccount'],
            });
            break;

          case Platform.Receiver_Crypto:
            details = await this.receiverCryptoRepo.find({
              where: { userAccount: { account_id } },
              relations: ['userAccount'],
            });
            break;

          default:
            details = [{ message: 'Tipo no soportado' }];
        }

        // Mapear los detalles de forma segura, evitando undefined
        const mappedDetails = details.map((d) => ({
          account_id:
            d.account_id ?? d.bankId ?? d.receiver_crypto ?? d.virtual_bank_id,
          currency: d.currency,
          type: d.type,
          accountName: d.accountName ?? d.bank_name,
          email: d.email ?? d.email_account,
          firstName: d.firstName,
          lastName: d.lastName,
          network: d.network,
          wallet: d.wallet,
          pix_key: d.pix_key,
          pix_value: d.pix_value,
          cpf: d.cpf,
          send_method_key: d.send_method_key,
          send_method_value: d.send_method_value,
          document_type: d.document_type,
          document_value: d.document_value,
          userAccount: d.userAccount,
        }));

        return {
          accountName: account.accountName,

          payment_type: typeId,
          details: mappedDetails,
        };
      }),
    );

    return enrichedAccounts;
  }

  // filtrar cuenta de banco especifica mediante id del usuario e id del banco
  async findOneUserBank(userId: string, bankAccountId?: string) {
    // Traemos todas las cuentas del usuario
    const allBanks = await this.findAllBanks(userId);

    if (!bankAccountId) {
      return allBanks;
    }

    //  Si pasamos bankAccountId, filtramos
    const found = allBanks.find((bank) =>
      bank.details.some((d) => d.account_id === bankAccountId),
    );

    if (!found) {
      throw new NotFoundException('Cuenta no encontrada para este usuario');
    }

    //  Filtramos los detalles para devolver solo el que coincide
    const filteredDetails = found.details.filter(
      (d) => d.account_id === bankAccountId,
    );

    return {
      ...found,
      details: filteredDetails,
    };
  }
}
