import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsUUID, IsString, Length, IsOptional } from 'class-validator';

export class CreateFinancialAccountDto {
  @ApiProperty()
  @IsUUID()
  paymentPlatformId: string;

  @ApiProperty()
  @IsUUID()
  referenceId: string;

  @ApiProperty()
  @IsString()
  referenceType: string;

  @ApiProperty()
  @IsUUID()
  userId: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @Length(1, 20)
  ownerType?: string;
}
