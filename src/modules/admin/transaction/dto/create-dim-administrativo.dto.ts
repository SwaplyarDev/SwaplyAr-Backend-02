import { IsNotEmpty, IsOptional, IsString, IsEmail, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateDimAdministrativoDto {
  @ApiProperty({ description: 'Nombre completo', example: 'Nahuel Davila' })
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @ApiProperty({ description: 'Nombre', example: 'Nahuel' })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ description: 'Apellido', example: 'Davila' })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({ description: 'Horas de trabajo', example: '8:00 - 17:00' })
  @IsOptional()
  @IsString()
  workHours?: string;

  @ApiProperty({ description: 'Hora de entrada', example: '08:00' })
  @IsOptional()
  @IsString()
  entryTime?: string;

  @ApiProperty({ description: 'Hora de salida', example: '17:00' })
  @IsOptional()
  @IsString()
  exitTime?: string;

  @ApiProperty({ description: 'Telefono', example: '1234567890' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ description: 'Email', example: 'nahuel@gmail.com' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({
    description: 'Documento nacional de identidad',
    example: '1234567890',
  })
  @IsOptional()
  @IsString()
  nationalId?: string;

  @ApiProperty({
    description: 'Fecha de contratacion',
    example: '2021-01-01:00:00:00',
  })
  @IsOptional()
  @IsDateString()
  hireDate?: Date;
}
