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
import { UserPayPal } from './entities/user-paypal.entity';
import { UserWise } from './entities/user-wise.entity';
import { UserPayoneer } from './entities/user-payoneer.entity';
import { UserPix } from './entities/user-pix.entity';
import { Platform } from 'src/enum/platform.enum';

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
    @InjectRepository(UserPayPal)
    private readonly payPalRepo: Repository<UserPayPal>,
    @InjectRepository(UserWise)
    private readonly wiseRepo: Repository<UserWise>,
    @InjectRepository(UserPayoneer)
    private readonly payoneerRepo: Repository<UserPayoneer>,
    @InjectRepository(UserPix)
    private readonly pixRepo: Repository<UserPix>,
  ) {}

  async createUserBank(
    formData: Record<string, any>,
    typeAccount: string,
    userAccValues: any,
    userId: string,
  ) {
    try {
      validateFields(typeAccount, formData, 'create');
      validateUserAccount(userAccValues);

      const userAccount = this.userAccountRepo.create({
        accountName: userAccValues.account_name,
        currency: userAccValues.currency,
        typeId: userAccValues.account_type,
        status: true,
        userId,
      });
      const savedUserAccount = await this.userAccountRepo.save(userAccount);
      let specificAccount;
      if (typeAccount === 'bank') {
        specificAccount = this.bankAccountRepo.create({
          ...formData,
          account_id: savedUserAccount.account_id,
          userAccount: savedUserAccount,
        });
        await this.bankAccountRepo.save(specificAccount);
      } else if (typeAccount === 'virtual_bank') {
        specificAccount = this.virtualBankRepo.create({
          ...formData,
          account_id: savedUserAccount.account_id,
          userAccount: savedUserAccount,
        });
        await this.virtualBankRepo.save(specificAccount);
      } else if (typeAccount === 'receiver_crypto') {
        specificAccount = this.receiverCryptoRepo.create({
          ...formData,
          account_id: savedUserAccount.account_id,
          userAccount: savedUserAccount,
        });
        await this.receiverCryptoRepo.save(specificAccount);
      } else if (typeAccount === 'paypal') {
        specificAccount = this.payPalRepo.create({
          ...formData,
          account_id: savedUserAccount.account_id,
          userAccount: savedUserAccount,
        });
        await this.payPalRepo.save(specificAccount);
      } else if (typeAccount === 'wise') {
        specificAccount = this.wiseRepo.create({
          ...formData,
          account_id: savedUserAccount.account_id,
          userAccount: savedUserAccount,
        });
        await this.wiseRepo.save(specificAccount);
      } else if (typeAccount === 'payoneer') {
        specificAccount = this.payoneerRepo.create({
          ...formData,
          account_id: savedUserAccount.account_id,
          userAccount: savedUserAccount,
        });
        await this.payoneerRepo.save(specificAccount);
      } else if (typeAccount === 'pix') {
        specificAccount = this.pixRepo.create({
          ...formData,
          account_id: savedUserAccount.account_id,
          userAccount: savedUserAccount,
        });
        await this.pixRepo.save(specificAccount);
      }

      return {
        message: 'bank created',
        bank: savedUserAccount,
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
    switch (userAccount.typeId) {
      case 'bank': // Bank
        await this.bankAccountRepo.delete({ account_id: bankAccountId });
        break;
      case 'paypal': // PayPal
        await this.payPalRepo.delete({ account_id: bankAccountId });
        break;
      case 'wise': // Wise
        await this.wiseRepo.delete({ account_id: bankAccountId });
        break;
      case 'payoneer': // Payoneer
        await this.payoneerRepo.delete({ account_id: bankAccountId });
        break;
      case 'pix': // Pix
        await this.pixRepo.delete({ account_id: bankAccountId });
        break;
      case 'virtual_bank': // Virtual Bank
        await this.virtualBankRepo.delete({ account_id: bankAccountId });
        break;
      case 'receiver_crypto': // Receiver Crypto
        await this.receiverCryptoRepo.delete({ account_id: bankAccountId });
        break;
      default:
        throw new BadRequestException('Tipo de cuenta no soportado');
    }

    // Elimina la cuenta principal
    await this.userAccountRepo.delete({ account_id: bankAccountId });

    return { message: 'Cuenta eliminada correctamente' };
  }

  async findAllBanks(user: any) {
    const accounts = await this.userAccountRepo.find({
      where: { userId: user.id },
    });

    const enrichedAccounts = await Promise.all(
      accounts.map(async (account) => {
        const typeId = account.typeId as Platform;
        const { account_id } = account;

        let details: any[] = [];
        // Dependiendo el typeId busca los detalles de la cuenta de banco
        switch (typeId) {
          case Platform.Bank:
            details = await this.bankAccountRepo.find({
              where: { account_id },
            });
            break;
          case Platform.PayPal:
            details = await this.payPalRepo.find({ where: { account_id } });
            break;
          case Platform.Wise:
            details = await this.wiseRepo.find({ where: { account_id } });
            break;
          case Platform.Payoneer:
            details = await this.payoneerRepo.find({ where: { account_id } });
            break;
          case Platform.Pix:
            details = await this.pixRepo.find({ where: { account_id } });
            break;
          case Platform.Virtual_Bank:
            details = await this.virtualBankRepo.find({
              where: { account_id },
            });
            break;
          case Platform.Receiver_Crypto:
            details = await this.receiverCryptoRepo.find({
              where: { account_id },
            });

            break;
          default:
            details = [{ message: 'Tipo no soportado' }];
        }

        // Seleccioná solo los campos que vas a devolver
        return {
          accountName: account.accountName,
          currency: account.currency,
          status: account.status,
          payment_type: account.typeId,
          details: details.map((d) => ({
            /** ---------------------- CAMPOS GENERALES ---------------------- **/
            account_id: d.account_id, // Usado por: Wise, Receiver, Virtual Bank, PayPal
            iban: d.iban, // Usado por: Wise, Payoneer
            bic: d.bic, // Usado por: Wise, Payoneer
            email_account: d.email_account, // Usado por: Wise, Virtual Bank, PayPal, Payoneer
            transfer_code: d.transfer_code, // Usado por: Wise, Receiver, Virtual Bank, PayPal, Payoneer
            userAccount: d.userAccount, // Usado por: Wise, Receiver, Virtual Bank, PayPal
            currency: d.currency, // Usado por: Receiver Crypto, Virtual Bank

            /** ---------------------- PIX ---------------------- **/
            pix_key: d.pix_key,
            pix_value: d.pix_value,
            cpf: d.cpf,

            /** ---------------------- BANK ---------------------- **/
            bank_name: d.bank_name,
            send_method_key: d.send_method_key,
            send_method_value: d.send_method_value,
            document_type: d.document_type,
            document_value: d.document_value,

            /** ---------------------- WISE ---------------------- **/
            wise_id: d.wise_id,

            /** ----------------- RECEIVER CRYPTO ---------------- **/
            receiver_crypto: d.receiver_crypto,
            network: d.network,
            wallet: d.wallet,

            /** ------------------- VIRTUAL BANK ----------------- **/
            virtual_bank_id: d.virtual_bank,
          })),
        };
      }),
    );

    return enrichedAccounts;
  }

  // filtrar cuenta de banco especifica mediante id del usuario e id del banco
  async findOneUserBank(userId: string, bankAccountId?: string) {
    // 1️⃣ Traemos todas las cuentas del usuario
    const allBanks = await this.findAllBanks(userId);
    // Tu método actual que arma la respuesta con payment_type, details, etc.

    // 2️⃣ Si no pasamos bankAccountId, devolvemos todo
    if (!bankAccountId) {
      return allBanks;
    }

    // 3️⃣ Si pasamos bankAccountId, filtramos
    const found = allBanks.find((bank) =>
      bank.details.some((d) => d.account_id === bankAccountId),
    );

    if (!found) {
      throw new NotFoundException('Cuenta no encontrada para este usuario');
    }

    // 4️⃣ Filtramos los detalles para devolver solo el que coincide
    const filteredDetails = found.details.filter(
      (d) => d.account_id === bankAccountId,
    );

    return {
      ...found,
      details: filteredDetails,
    };
  }
}
