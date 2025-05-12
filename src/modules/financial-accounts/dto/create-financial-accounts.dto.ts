import { CreateReceiverFinancialAccountDto } from "@financial-accounts/receiver-financial-accounts/dto/create-receiver-financial-account.dto";
import { CreateSenderFinancialAccountDto } from "@financial-accounts/sender-financial-accounts/dto/create-sender-financial-account.dto";

export class CreateFinancialAccountDto {
    senderAccount: CreateSenderFinancialAccountDto;
    receiverAccount: CreateReceiverFinancialAccountDto;
    
}
