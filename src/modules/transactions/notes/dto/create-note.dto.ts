import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { IsIn } from 'class-validator';

export class CreateNoteDto {
  @IsString({ message: 'El campo "message" debe ser un texto' })
  @IsNotEmpty({ message: 'El campo "message" es obligatorio' })
  message: string;

  @IsString({ message: 'El campo "section" debe ser un texto' })
  @IsNotEmpty({ message: 'El campo "section" es obligatorio' })
  @IsIn(['datos_envio', 'datos_recepcion', 'monto'], {
    message: 'La sección debe ser: datos_envio, datos_recepcion o monto',
  })
  section: string;
}

export class CreateNoteOTPDto {
  @IsString({ message: 'El campo "transactionId" debe ser un id valido' })
  @IsNotEmpty({ message: 'El campo "transactionId" es obligatorio' })
  @ApiProperty({ example: 'vFHi5iOLbC' })
  transactionId: string;
}

export class TransactionInfoDto {
  @ApiProperty({ example: 'vFHi5iOLbC' })
  id: string;
}

export class CreateNoteResponseDto {
  @ApiProperty({ example: 'uuid' })
  note_id: string;

  @ApiProperty({ example: 'Nota de prueba' })
  message: string;

  @ApiProperty({ example: 'https://url.com/nota.png' })
  img_url: string;

  @ApiProperty({ example: '2024-01-01T00:00:00Z' })
  createdAt: Date;

  @ApiProperty({ type: TransactionInfoDto })
  transaction: TransactionInfoDto;
}
