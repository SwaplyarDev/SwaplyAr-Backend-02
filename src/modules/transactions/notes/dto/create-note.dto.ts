import { IsNotEmpty, IsString } from 'class-validator';

export class CreateNoteDto {
  @IsString({ message: 'El campo "message" debe ser un texto' })
  @IsNotEmpty({ message: 'El campo "message" es obligatorio' })
  message: string;
}
