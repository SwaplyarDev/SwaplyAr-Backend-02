import { IsOptional, IsString } from 'class-validator';

export class UpdateReceiverDto {
  @IsOptional()
  @IsString()
  bankName?: string;

  @IsOptional()
  @IsString()
  sendMethodValue?: string;

  @IsOptional()
  @IsString()
  documentValue?: string;
} 