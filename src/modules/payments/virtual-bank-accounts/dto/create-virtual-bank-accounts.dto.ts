import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsUUID, IsEmail, IsOptional, IsString, Length, IsBoolean } from 'class-validator';

export class CreateVirtualBankAccountDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  userId?: string;

  @ApiProperty()
  @IsUUID()
  paymentProviderId: string;

  @ApiProperty()
  @IsEmail()
  emailAccount: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  accountAlias?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @Length(3, 3)
  currency?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  ownerType?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
