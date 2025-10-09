import { IsString, IsBoolean, IsUUID, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class PaymentMethodResponseDto {
  @IsString()
  platformId: string;

  @IsString()
  method: string;

  @IsOptional()
  @IsString()
  type?: string;
}

class FinancialAccountResponseDto {
  @IsUUID()
  id: string;

  @IsOptional() // <-- opcional solo para crypto
  @IsString()
  firstName?: string;

  @IsOptional() // <-- opcional solo para crypto
  @IsString()
  lastName?: string;

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
  createdAt: Date;

  @IsString()
  updatedAt: Date;

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
