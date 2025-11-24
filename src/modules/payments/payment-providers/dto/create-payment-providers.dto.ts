import {
  IsString,
  IsOptional,
  IsBoolean,
  Length,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { CreatePaymentPlatformsDto } from '../../payment-platforms/dto/create-payment-platforms.dto';

export class CreatePaymentProvidersDto {
  @ApiProperty({ description: 'Nombre del proveedor', example: 'PAYPAL' })
  @IsString()
  @MaxLength(100)
  name: string;

  @ApiProperty({ description: 'Código único del proveedor', example: 'PAYPAL' })
  @IsString()
  @Length(2, 50)
  code: string;

  @ApiProperty({ description: 'País del proveedor', example: 'ARG' })
  @IsOptional()
  @IsString()
  @Length(2, 3)
  country?: string;

  @ApiProperty({
    description: 'Logo del proveedor',
    example: 'https://res.cloudinary.com/dwrhturiy/image/upload/v1726600628/paypal.dark_lgvm7j.png',
  })
  @IsOptional()
  @IsString()
  logo_url?: string;

  @ApiProperty({ description: 'Indica si el proveedor esta activo', example: 'true' })
  @IsOptional()
  @IsBoolean()
  is_active?: boolean;

  @ApiProperty({
    description: 'Id la plataforma de pago asociada',
    example: {
      payment_platform_id: 'e4d6db73-2064-4b53-ad4f-bd6c5d7170ca',
      code: 'BANK',
      title: 'Bank Platform',
      description: 'Plataforma bancaria tradicional edit',
      is_active: true,
      created_at: '2025-11-18T12:24:18.058Z',
      providers: [],
      financialAccounts: [],
    },
  })
  @ValidateNested()
  @Type(() => CreatePaymentPlatformsDto)
  @IsOptional()
  payment_platform: CreatePaymentPlatformsDto;
}
