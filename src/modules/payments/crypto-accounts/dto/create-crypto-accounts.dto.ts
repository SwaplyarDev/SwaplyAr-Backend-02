import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsUUID, IsString, IsOptional, Length, IsBoolean } from 'class-validator';

export class CreateCryptoAccountDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  userId?: string;

  @ApiProperty()
  @IsUUID()
  paymentProviderId: string;

  @ApiProperty()
  @IsUUID()
  cryptoNetworkId: string;

  @ApiProperty()
  @IsString()
  walletAddress: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  tagOrMemo?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @Length(1, 20)
  ownerType?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
