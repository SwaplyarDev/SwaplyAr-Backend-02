import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateNoteDto {
  @IsString({ message: 'El campo "message" debe ser un texto' })
  @IsNotEmpty({ message: 'El campo "message" es obligatorio' })
  @ApiProperty({ example: 'Nota actualizada' })
  message: string;

  @IsString({ message: 'El campo "section" debe ser un texto' })
  @IsNotEmpty({ message: 'El campo "section" es obligatorio' })
  @ApiProperty({ example: 'Detalles de nota' })
  section: string;
}
