import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsUUID, IsString, IsOptional, Length, IsBoolean } from 'class-validator';

export class CreateCryptoAccountDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440001' })
  @IsUUID()
  paymentProviderId: string;

  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440002' })
  @IsUUID()
  cryptoNetworkId: string;

  @ApiProperty({ example: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa' })
  @IsString()
  walletAddress: string;

  @ApiPropertyOptional({ example: '123456789' })
  @IsOptional()
  @IsString()
  tagOrMemo?: string;

  @ApiPropertyOptional({ example: 'individual' })
  @IsOptional()
  @IsString()
  @Length(1, 20)
  ownerType?: string;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({
    example: '550e8400-e29b-41d4-a716-446655440003',
    description: 'ID de la moneda (debe ser soportada por el Payment Provider)',
  })
  @IsOptional()
  @IsUUID()
  currencyId?: string;
}
