import {
  IsString,
  IsOptional,
  IsBoolean,
  Length,
  MaxLength,
  IsUUID,
  IsIn,
  IsUrl,
  IsUppercase,
  IsArray,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePaymentProvidersDto {
  @ApiProperty({ description: 'Nombre del proveedor', example: 'PayPal' })
  @IsString()
  @MaxLength(100)
  name: string;

  @ApiProperty({ description: 'Código único del proveedor', example: 'paypal' })
  @IsString()
  @Length(2, 50)
  code: string;

  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440002', description: 'ID del país' })
  @IsUUID()
  countryId: string;

  @ApiPropertyOptional({
    description: 'URL del logo del proveedor',
    example: 'https://res.cloudinary.com/dwrhturiy/image/upload/v1726600628/paypal.dark_lgvm7j.png',
  })
  @IsOptional()
  @IsString()
  @IsUrl()
  logoUrl?: string;

  @ApiPropertyOptional({
    description: 'Tipo de operación permitida',
    example: 'both',
    enum: ['send', 'receive', 'both'],
  })
  @IsOptional()
  @IsString()
  @IsIn(['send', 'receive', 'both'])
  operationType?: string;

  @ApiPropertyOptional({
    description: 'Indica si el proveedor esta activo',
    example: true,
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({
    description: 'ID de la plataforma de pago asociada (UUID)',
    example: 'e4d6db73-2064-4b53-ad4f-bd6c5d7170ca',
  })
  @IsUUID()
  paymentPlatformId: string;

  @ApiPropertyOptional({
    description: 'IDs de las monedas soportadas (opcional)',
    example: ['550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440002'],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  currencyIds?: string[];
}
