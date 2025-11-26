import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateNoteDto {
  @IsString({ message: 'El campo "message" debe ser un texto' })
  @IsNotEmpty({ message: 'El campo "message" es obligatorio' })
  @ApiProperty({ example: 'Nota actualizada' })
  message: string;

  @IsString({ message: 'El campo "img_url" debe ser una url valida' })
  @IsNotEmpty({ message: 'El campo "img_url" es obligatorio' })
  @ApiProperty({ example: 'https://url.com/nota.png' })
  img_url: string;
}
