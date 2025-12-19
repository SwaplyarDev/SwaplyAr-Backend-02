import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsUUID, IsEmail, IsOptional, IsString, IsBoolean } from 'class-validator';

export class CreateVirtualBankAccountDto {
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

  @ApiProperty({
    description: 'ID de la moneda',
    example: 'uuid-de-moneda',
  })
  @IsOptional()
  @IsUUID('4')
  currencyId?: string;

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
