import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { CreateBankAccountDto } from './dto/create-bank-account.dto';
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
      } else if (typeAccount === 'virtualBank') {
        specificAccount = this.virtualBankRepo.create({
          ...formData,
          account_id: savedUserAccount.account_id,
          userAccount: savedUserAccount,
        });
        await this.virtualBankRepo.save(specificAccount);
      } else if (typeAccount === 'crypto') {
        specificAccount = this.receiverCryptoRepo.create({
          ...formData,
          account_id: savedUserAccount.account_id,
          userAccount: savedUserAccount,
        });
        await this.receiverCryptoRepo.save(specificAccount);
      } else if (typeAccount === 'crypto') {
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

      return { message: 'bank created', bank: savedUserAccount, details: specificAccount };
    } catch (err) {
      this.logger.error('Error creating bank:', err);
      throw new BadRequestException('Error creating bank account');
    }
  }
}