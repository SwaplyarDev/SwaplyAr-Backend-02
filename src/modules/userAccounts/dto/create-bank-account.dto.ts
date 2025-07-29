import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsObject,
  ValidateNested,
} from 'class-validator';
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
  @IsString()
  @IsNotEmpty()
  first_name: string;

  @IsString()
  @IsNotEmpty()
  last_name: string;

  @IsString()
  @IsNotEmpty()
  identification: string;

  @IsString()
  @IsNotEmpty()
  currency: string;

  @IsString()
  @IsNotEmpty()
  account_name: string;

  @IsNumber()
  @Type(() => Number)
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
