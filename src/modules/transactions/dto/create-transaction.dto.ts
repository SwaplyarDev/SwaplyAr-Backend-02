import { CreateAmountDto } from '@transactions/amounts/dto/create-amount.dto';
import { CreateFinancialAccountDto } from './../../financial-accounts/dto/create-financial-accounts.dto';

export class CreateTransactionDto {
  paymentsId: string;
  countryTransaction: string;
  message: string;
  createdBy: string;
  financialAccounts: CreateFinancialAccountDto;
  amount: CreateAmountDto;
}
