import { CreateReceiverFinancialAccountDto } from '@financial-accounts/receiver-financial-accounts/dto/create-receiver-financial-account.dto';
import { CreateSenderFinancialAccountDto } from '@financial-accounts/sender-financial-accounts/dto/create-sender-financial-account.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsObject, ValidateNested } from 'class-validator';

export class CreateFinancialAccountDto {
  @ApiProperty({ description: 'Cuenta emisora' })
  @ValidateNested()
  @Type(() => CreateSenderFinancialAccountDto)
  senderAccount: CreateSenderFinancialAccountDto;

  @ApiProperty({ description: 'Cuenta receptora' })
  @ValidateNested()
  @Type(() => CreateReceiverFinancialAccountDto)
  receiverAccount: CreateReceiverFinancialAccountDto;
}
