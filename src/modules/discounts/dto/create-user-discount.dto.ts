import { IsString, IsOptional, IsUUID } from 'class-validator';

export class CreateUserDiscountDto {
  @IsString()
  userId: string;

  @IsOptional()
  @IsUUID()
  codeId?: string;

  @IsOptional()
  @IsString()
  code?: string;

  @IsOptional()
  @IsString()
  transactionId?: string;
}