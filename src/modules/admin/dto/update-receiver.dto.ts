import { IsOptional, IsString } from 'class-validator';

export class UpdateReceiverDto {
  @IsOptional()
  @IsString()
  bank_name?: string;

  @IsOptional()
  @IsString()
  sender_method_value?: string;

  @IsOptional()
  @IsString()
  document_value?: string;
} 