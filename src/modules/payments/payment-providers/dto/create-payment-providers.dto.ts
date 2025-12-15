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
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CreatePaymentPlatformsDto } from '../../payment-platforms/dto/create-payment-platforms.dto';

export class CreatePaymentProvidersDto {
  @ApiProperty({ description: 'Nombre del proveedor', example: 'PayPal' })
  @IsString()
  @MaxLength(100)
  name: string;

  @ApiProperty({ description: 'Código único del proveedor', example: 'paypal' })
  @IsString()
  @Length(2, 50)
  code: string;

  @ApiPropertyOptional({ description: 'Código de país ISO 3166-1 alpha-3', example: 'ARG' })
  @IsOptional()
  @IsString()
  @Length(3, 3)
  @IsUppercase()
  countryCode?: string;

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

  @ApiProperty({ description: 'ID de la plataforma asociada' })
  @IsUUID()
  paymentPlatformId: string;
}
