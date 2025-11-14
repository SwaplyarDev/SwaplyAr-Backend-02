import { IsString, IsBoolean, IsUUID, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

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

export class DetailsUserAccountDto {
  @ApiProperty({ example: 'f4338078-8c08-468c-ad92-134d37e0b405' })
  account_id: string;

  @ApiProperty({ example: 'dylan.rojo@paypal.com' })
  email_account: string;

  @ApiProperty({ example: '9876543' })
  transfer_code: number;
}

export class AuthenticatedUserAccountResponseDto {
  @ApiProperty({ example: 'Dylan' })
  accountName: string;

  @ApiProperty({ example: 'USD' })
  currency: string;

  @ApiProperty({ example: true })
  status: boolean;

  @ApiProperty({ example: 'paypal' })
  payment_type: string;

  @ApiProperty({ type: [DetailsUserAccountDto] })
  details: [DetailsUserAccountDto];
}

export class NotFoundUserAccountDto {
  @ApiProperty({ example: 'Cuenta no encontrada para este usuario' })
  message: string;
}
