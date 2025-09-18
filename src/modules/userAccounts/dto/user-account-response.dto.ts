import { IsString, IsBoolean, IsUUID, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class PaymentMethodResponseDto {
  @IsString()
  platformId: string;

  @IsString()
  method: string;

  @IsString()
  type: string;
}

class FinancialAccountResponseDto {
  @IsUUID()
  id: string;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @ValidateNested()
  @Type(() => PaymentMethodResponseDto)
  paymentMethod: PaymentMethodResponseDto;
}

class UserAccountResponseDto {
  @IsUUID()
  accountId: string;

  @IsString()
  accountName: string;

  @IsString()
  createdAt: Date; // ISO string, o Date si lo quieres transformar

  @IsString()
  updatedAt: Date; // ISO string, o Date si lo quieres transformar

  @IsBoolean()
  status: boolean;

  @IsUUID()
  userId: string;
}

export class CreateUserAccountResponseDto {
  @IsString()
  accountName: string;

  @ValidateNested()
  @Type(() => FinancialAccountResponseDto)
  financialAccount: FinancialAccountResponseDto;

  @ValidateNested()
  @Type(() => UserAccountResponseDto)
  userAccount: UserAccountResponseDto;
}
