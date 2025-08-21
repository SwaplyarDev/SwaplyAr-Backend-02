import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Platform } from 'src/enum/platform.enum';

export class UserAccValuesDto {
  //compartido
  @IsString()
  currency: string;
  @IsString()
  accountName: string;
  @IsEnum(Platform)
  accountType: Platform;

  //bank
  @IsOptional()
  @IsString()
  bankName: string;

  @IsOptional()
  @IsString()
  send_method_key: string;

  @IsOptional()
  @IsString()
  send_method_value: string;

  @IsOptional()
  @IsString()
  document_type: string;

  @IsOptional()
  @IsNumber()
  document_value: number;

  // receiver
  @IsOptional()
  @IsString()
  network: string;
  @IsOptional()
  @IsString()
  wallet: string;

  //virtual_bank
  @IsOptional()
  @IsString()
  email: string;

  @IsOptional()
  @IsString()
  firstName: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsString()
  type: Platform;

  // pix
  @IsOptional()
  @IsNumber()
  cpf: number;
  @IsOptional()
  @IsString()
  pix_value: string;
  @IsOptional()
  @IsString()
  pix_key: string;
}

export class CreateBankAccountDto {
  @ValidateNested()
  @Type(() => UserAccValuesDto)
  userAccValues: UserAccValuesDto;
}
