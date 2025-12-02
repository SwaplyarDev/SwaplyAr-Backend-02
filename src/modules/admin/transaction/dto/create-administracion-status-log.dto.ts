import { IsNotEmpty, IsUUID, IsEnum, IsOptional, IsString, IsObject } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Status } from 'src/enum/status.enum';

export class CreateAdministracionStatusLogDto {
  @ApiProperty({
    description: 'ID del master de administración asociado',
    example: '29e11aa2-4f5f-45c4-aac9-52da305c5313',
  })
  @IsUUID()
  @IsNotEmpty()
  transactionId: string;

  @ApiProperty({
    description: 'ID del administrador que realiza el cambio',
    example: 'ee91de3c-a697-4f93-b32a-c8b4f81bfa30',
  })
  @IsUUID()
  @IsNotEmpty()
  changedByAdminId: string;

  @ApiProperty({
    description: 'Nuevo estado del proceso administrativo',
    example: 'approved',
  })
  @IsEnum(Status)
  @IsNotEmpty()
  status: Status;

  @ApiPropertyOptional({
    description: 'Mensaje descriptivo del cambio de estado',
    example: 'Pago verificado correctamente',
  })
  @IsOptional()
  @IsString()
  message?: string;

  @ApiPropertyOptional({
    description: 'Datos adicionales del log (JSON)',
    example: { extraInfo: 'some value' },
  })
  @IsOptional()
  @IsObject()
  additionalData?: Record<string, any>;
}
