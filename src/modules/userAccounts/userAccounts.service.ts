import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserAccount } from './entities/user-account.entity';
import { FinancialAccountsService } from '../payments/financial-accounts/financial-accounts.service';


@Injectable()
export class AccountsService {
  private readonly logger = new Logger(AccountsService.name);

  constructor(
    @InjectRepository(UserAccount)
    private readonly userAccountRepo: Repository<UserAccount>,
    private readonly financialAccountsService: FinancialAccountsService, // servicio que crea FinancialAccount + PaymentMethod
  ) {}
}
