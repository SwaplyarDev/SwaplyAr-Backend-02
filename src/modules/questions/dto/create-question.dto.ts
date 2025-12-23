import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateQuestionDto {
  @ApiProperty({
    example: '¿Cómo se usa la app?',
    description: 'Título de la pregunta frecuente',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    example: 'Para usar la app, primero debés registrarte...',
    description: 'Descripción de la pregunta frecuente',
  })
  @IsString()
  @IsNotEmpty()
  description: string;
}
