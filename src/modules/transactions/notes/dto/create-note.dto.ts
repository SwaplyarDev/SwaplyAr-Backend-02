import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateNoteDto {
  @IsString()
  @ApiProperty({
    description: 'Mensaje asociado a la transacción',
    example: 'Pago recibido correctamente',
  })
  message: string;
}
