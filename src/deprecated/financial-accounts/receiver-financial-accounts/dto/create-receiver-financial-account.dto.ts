import { CreatePaymentMethodDto } from 'src/deprecated/financial-accounts/payment-methods/dto/create-payment-method.dto';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEmail, IsOptional, IsString, ValidateNested } from 'class-validator';

export class CreateReceiverFinancialAccountDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiProperty()
  @ValidateNested()
  @Type(() => CreatePaymentMethodDto)
  paymentMethod: CreatePaymentMethodDto;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  document_value?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  bank_name?: string;
}
