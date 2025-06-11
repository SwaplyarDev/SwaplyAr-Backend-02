import { IsOptional, IsString } from 'class-validator';

export class CreateBankDto {
  currency: string;
  bankName: string;
  sendMethodKey: string;
  sendMethodValue: string;
  documentType: string;
  documentValue: string;
}

export class UpdateBankDto {
  @IsOptional()
  @IsString()
  currency?: string;

  @IsOptional()
  @IsString()
  bankName?: string;

  @IsOptional()
  @IsString()
  sendMethodKey?: string;

  @IsOptional()
  @IsString()
  sendMethodValue?: string;

  @IsOptional()
  @IsString()
  documentType?: string;

  @IsOptional()
  @IsString()
  documentValue?: string;
}
