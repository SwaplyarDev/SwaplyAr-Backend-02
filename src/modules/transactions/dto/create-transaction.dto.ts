import { CreateReceiverFinancialAccountDto } from '@financial-accounts/receiver-financial-accounts/dto/create-receiver-financial-account.dto';
import { CreateSenderFinancialAccountDto } from '@financial-accounts/sender-financial-accounts/dto/create-sender-financial-account.dto';

export class CreateTransactionDto {
  paymentsId: string;
  countryTransaction: string;
  message: string;
  createdBy: string;
  //finalStatus: string; // Final status of the transaction (e.g., 'completed', 'pending', etc.)
  sender: CreateSenderFinancialAccountDto;
  receiver: CreateReceiverFinancialAccountDto;
}
