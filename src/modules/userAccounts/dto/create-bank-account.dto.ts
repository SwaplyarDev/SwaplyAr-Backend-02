import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsObject,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Platform } from 'src/enum/platform.enum';

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

  @IsEnum(Platform)
  account_type: Platform;
}

export class CreateBankAccountDto {
  @IsEnum(Platform)
  typeAccount: Platform;

  @IsObject()
  formData: Record<string, any>;

  @ValidateNested()
  @Type(() => UserAccValuesDto)
  userAccValues: UserAccValuesDto;
}
