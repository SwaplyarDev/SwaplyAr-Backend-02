import { IsOptional, IsString } from 'class-validator';

export class CreateBankDto {
  @IsString()
  currency: string;

  @IsString()
  bankName: string;

  @IsString()
  sendMethodKey: string;

  @IsString()
  sendMethodValue: string;

  @IsString()
  documentType: string;

  @IsString()
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
