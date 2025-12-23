import { IsNotEmpty, IsUUID, IsEnum, IsOptional, IsString, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Status } from 'src/enum/status.enum';

export class CreateAdministracionMasterDto {
  @ApiProperty({
    description: 'ID de la transacción original',
    example: 'TX12345678',
  })
  @IsString()
  @IsNotEmpty()
  transactionId: string;

  @ApiProperty({
    description: 'ID del administrador responsable',
    example: '29e11aa2-4f5f-45c4-aac9-52da305c5313',
  })
  @IsUUID()
  @IsNotEmpty()
  adminUserId: string;

  @ApiProperty({
    description: 'Estado del administrativo',
    example: 'pending',
    enum: Status,
  })
  @IsEnum(Status)
  @IsNotEmpty()
  status: Status;

  @ApiProperty({
    description: 'Fecha de inicio del proceso',
    example: '2025-01-01T00:00:00Z',
  })
  @IsOptional()
  @IsDateString()
  beginTransaction?: Date;

  @ApiProperty({
    description: 'Fecha de fin del proceso',
    example: '2025-01-01T12:00:00Z',
  })
  @IsOptional()
  @IsDateString()
  endTransaction?: Date;

  @ApiProperty({
    description: 'Descripción o información del recibo de transferencia',
    example: 'Transferencia recibida correctamente',
  })
  @IsOptional()
  @IsString()
  transferReceived?: string;
}
