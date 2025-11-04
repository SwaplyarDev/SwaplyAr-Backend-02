import { IsNotEmpty, IsString, IsIn } from 'class-validator';

export class CreateNoteDto {
  @IsString({ message: 'El campo "message" debe ser un texto' })
  @IsNotEmpty({ message: 'El campo "message" es obligatorio' })
  message: string;
  @IsString({ message: 'El campo "section" debe ser un texto' })
  @IsNotEmpty({ message: 'El campo "section" es obligatorio' })
  @IsIn(['datos_envio', 'datos_recepcion', 'monto'], {
    message: 'La sección debe ser: datos_envio, datos_recepcion o monto'
  })
  section: string;
}
