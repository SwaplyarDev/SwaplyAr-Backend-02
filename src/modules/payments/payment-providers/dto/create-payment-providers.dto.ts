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
    example: 'c2f08fd7-5ab5-4c66-8fa5-85103a49db31',
  })
  @ValidateNested()
  @Type(() => CreatePaymentPlatformsDto)
  @IsOptional()
  payment_platform: CreatePaymentPlatformsDto;
}
