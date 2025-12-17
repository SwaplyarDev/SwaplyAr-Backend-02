import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsUUID,
  IsString,
  IsOptional,
  IsBoolean,
  Length,
  MaxLength,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateBankAccountDetailDto {
  @ApiProperty({ example: 'routing_number' })
  @IsString()
  fieldKey: string;

  @ApiProperty({ example: 'Número de Ruta' })
  @IsString()
  fieldLabel: string;

  @ApiProperty({ example: '021000021' })
  @IsString()
  fieldValue: string;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsBoolean()
  isEncrypted?: boolean;
}

export class CreateBankAccountDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440001' })
  @IsUUID()
  paymentProviderId: string;

  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440002', description: 'ID del país' })
  @IsUUID()
  countryId: string;

  @ApiProperty({ example: 'Juan Pérez' })
  @IsString()
  @MaxLength(150)
  holderName: string;

  @ApiPropertyOptional({ example: 'DNI' })
  @IsOptional()
  @IsString()
  documentType?: string;

  @ApiPropertyOptional({ example: '12345678' })
  @IsOptional()
  @IsString()
  documentValue?: string;

  @ApiPropertyOptional({ example: 'Banco Santander' })
  @IsOptional()
  @IsString()
  bankName?: string;

  @ApiPropertyOptional({ example: '1234567890123456' })
  @IsOptional()
  @IsString()
  accountNumber?: string;

  @ApiPropertyOptional({ example: 'ES9121000418450200051332' })
  @IsOptional()
  @IsString()
  iban?: string;

  @ApiPropertyOptional({ example: 'BSCHESMMXXX' })
  @IsOptional()
  @IsString()
  swift?: string;

  @ApiProperty({
    description: 'ID de la moneda',
    example: 'uuid-de-moneda',
  })
  @IsOptional()
  @IsUUID('4')
  currencyId?: string;

  @ApiPropertyOptional({ example: 'individual' })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  ownerType?: string;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({ type: [CreateBankAccountDetailDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateBankAccountDetailDto)
  details?: CreateBankAccountDetailDto[];
}
