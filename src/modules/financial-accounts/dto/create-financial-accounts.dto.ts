import { CreateReceiverFinancialAccountDto } from '@financial-accounts/receiver-financial-accounts/dto/create-receiver-financial-account.dto';
import { CreateSenderFinancialAccountDto } from '@financial-accounts/sender-financial-accounts/dto/create-sender-financial-account.dto';
import { ApiProperty } from '@nestjs/swagger';

export class CreateFinancialAccountDto {
  @ApiProperty({ description: 'Cuenta emisora', example: '123' })
  senderAccount: CreateSenderFinancialAccountDto;
  @ApiProperty({ description: 'Cuenta receptora', example: '123' })
  receiverAccount: CreateReceiverFinancialAccountDto;
}
