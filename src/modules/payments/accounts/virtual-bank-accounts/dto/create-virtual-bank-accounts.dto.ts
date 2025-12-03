import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsUUID, IsEmail, IsOptional, IsString, Length, IsBoolean } from 'class-validator';

export class CreateVirtualBankAccountDto {
  @ApiPropertyOptional({
    description: 'ID del usuario dueño de la cuenta',
    example: 'f3a1c89e-8d92-4a61-9b5a-2b6c46e2c8dd',
  })
  @IsOptional()
  @IsUUID()
  userId?: string;

  @ApiProperty({
    description: 'ID del proveedor de pago asociado',
    example: '92c7e1c2-2739-4e2f-94f3-fb6e0d2e5bd1',
  })
  @IsUUID()
  paymentProviderId: string;

  @ApiProperty({
    description: 'Email de la cuenta virtual',
    example: 'cuenta.virtual@bank.com',
  })
  @IsEmail()
  emailAccount: string;

  @ApiPropertyOptional({
    description: 'Alias de la cuenta virtual',
    example: 'cuenta_secundaria',
  })
  @IsOptional()
  @IsString()
  accountAlias?: string;

  @ApiPropertyOptional({
    description: 'Moneda de la cuenta (ISO 4217)',
    example: 'USD',
  })
  @IsOptional()
  @IsString()
  @Length(3, 3)
  currency?: string;

  @ApiPropertyOptional({
    description: 'Tipo de dueño de la cuenta',
    example: 'individual',
  })
  @IsOptional()
  @IsString()
  ownerType?: string;

  @ApiPropertyOptional({
    description: 'Indica si la cuenta está activa',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
