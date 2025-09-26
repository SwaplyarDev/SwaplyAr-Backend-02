import { IsNotEmpty, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateStatusDto {
  @ApiProperty({ description: 'ID de la transaccion', example: '1234567890' })
  @IsUUID()
  @IsNotEmpty()
  transactionId: string;
}
