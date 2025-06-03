import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { CreateBankAccountDto } from './dto/create-bank-account.dto';
import { validateFields } from './helpers/validate-fields.helper';
import { validateUserAccount } from './helpers/validate-user-account.helper';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserAccount } from './entities/user-account.entity';
import { UserBank } from './entities/user-bank.entity';

@Injectable()
export class AccountsService {
  private readonly logger = new Logger(AccountsService.name);

  constructor(
    @InjectRepository(UserAccount)
    private readonly userAccountRepo: Repository<UserAccount>,
    @InjectRepository(UserBank)
    private readonly bankAccountRepo: Repository<UserBank>,
    // ...otros repositorios...
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
      } 

      return { message: 'bank created', bank: savedUserAccount, details: specificAccount };
    } catch (err) {
      this.logger.error('Error creating bank:', err);
      throw new BadRequestException('Error creating bank account');
    }
  }
}