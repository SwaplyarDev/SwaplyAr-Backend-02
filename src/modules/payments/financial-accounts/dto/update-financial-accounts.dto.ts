import { IsOptional, IsUUID, IsString, Length } from 'class-validator';

export class UpdateFinancialAccountDto {
  @IsOptional()
  @IsUUID()
  paymentPlatformId?: string;

  @IsOptional()
  @IsUUID()
  referenceId?: string;

  @IsOptional()
  @IsUUID()
  userId?: string;

  @IsOptional()
  @IsString()
  @Length(1, 20)
  ownerType?: string;

  @IsOptional()
  @IsUUID()
  createdBy?: string;
}
