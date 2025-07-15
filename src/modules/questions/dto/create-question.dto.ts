import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class CreateQuestionDto {
  // @IsString()
  // @IsNotEmpty()
  // title: string;

  // @IsString()
  // @IsNotEmpty()
  // description: string;
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