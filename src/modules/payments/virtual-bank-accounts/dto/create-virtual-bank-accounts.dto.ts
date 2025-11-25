import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsUUID, IsEmail, IsOptional, IsString, Length, IsBoolean } from 'class-validator';

export class CreateVirtualBankAccountDto {
  @ApiPropertyOptional({ description: 'ID del usuario dueño de la cuenta' })
  @IsOptional()
  @IsUUID()
  userId?: string;

  @ApiProperty({ description: 'ID del proveedor de pago asociado' })
  @IsUUID()
  paymentProviderId: string;

  @ApiProperty({ description: 'Email de la cuenta virtual' })
  @IsEmail()
  emailAccount: string;

  @ApiPropertyOptional({ description: 'Alias de la cuenta virtual' })
  @IsOptional()
  @IsString()
  accountAlias?: string;

  @ApiPropertyOptional({ description: 'Moneda de la cuenta (ISO 4217)' })
  @IsOptional()
  @IsString()
  @Length(3, 3)
  currency?: string;

  @ApiPropertyOptional({ description: 'Tipo de dueño de la cuenta' })
  @IsOptional()
  @IsString()
  ownerType?: string;

  @ApiPropertyOptional({ description: 'Indica si la cuenta está activa' })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
