import { IsString, IsOptional, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUserDiscountDto {
  @ApiProperty({ description: 'ID del usuario' })
  @IsString()
  userId: string;

  @ApiPropertyOptional({ description: 'ID del código de descuento (UUID)' })
  @IsOptional()
  @IsUUID()
  codeId?: string;

  @ApiPropertyOptional({ description: 'Código de descuento' })
  @IsOptional()
  @IsString()
  code?: string;

  @ApiPropertyOptional({ description: 'ID de la transacción' })
  @IsOptional()
  @IsString()
  transactionId?: string;
}
