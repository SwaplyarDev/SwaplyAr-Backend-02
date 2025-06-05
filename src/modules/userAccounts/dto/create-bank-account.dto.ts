import { IsEnum, IsObject, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export enum AccountType {
  BANK = 'bank',
  CRYPTO = 'crypto',
  VIRTUAL_BANK = 'virtualBank',
  PIX = 'pix',
  PAYPAL = 'paypal',
  PAYONEER = 'payoneer',
  WISE = 'wise',
}

export class UserAccValuesDto {
  first_name: string;
  last_name: string;
  identification: string;
  currency: string;
  account_name: string;
  account_type: number;
}

export class CreateBankAccountDto {
  @IsEnum(AccountType)
  typeAccount: AccountType;

  @IsObject()
  formData: Record<string, any>;

  @ValidateNested()
  @Type(() => UserAccValuesDto)
  userAccValues: UserAccValuesDto;
}