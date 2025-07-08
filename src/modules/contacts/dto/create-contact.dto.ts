import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateContactDto {
  @ApiProperty({ example: 'Pedro', description: 'Nombre del contacto' })
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'Rodriguez', description: 'Apellido del contacto' })
  @IsNotEmpty()
  lastname: string;

  @ApiProperty({ example: 'pedro@mail.com', description: 'Correo electrónico' })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'Hola, quiero info',
    description: 'Mensaje del contacto',
  })
  @IsNotEmpty()
  message: string;

  @ApiProperty({
    example: 'abc123',
    required: false,
    description: 'ID del usuario (opcional)',
  })
  @IsOptional()
  user_id?: string;
}
