import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RequestNoteCodeDto {
  @IsString()
  @ApiProperty({
    description: 'ID de la transacción para la que se solicita el código OTP',
    example: 'uuid-transaccion',
  })
  transactionId: string;
}
