import { IsUUID, IsString, Length } from 'class-validator';

export class CreateFinancialAccountDto {
  @IsUUID()
  paymentPlatformId: string;

  @IsUUID()
  referenceId: string;

  @IsUUID()
  userId: string;

  @IsString()
  @Length(1, 20)
  ownerType: string;

  @IsUUID()
  createdBy: string;
}
