import { IsNotEmpty, IsUUID, IsEnum, IsOptional, IsString, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { AdminStatus } from 'src/enum/admin-status.enum';

export class CreateAdministracionMasterDto {
  @ApiProperty({ description: 'ID de la transaccion', example: '123' })
  @IsUUID()
  @IsNotEmpty()
  transactionId: string;

  @ApiProperty({ description: 'ID del administrativo', example: '1234567890' })
  @IsUUID()
  @IsNotEmpty()
  administrativoId: string;

  @ApiProperty({
    description: 'Estado del administrativo',
    example: '1234567890',
  })
  @IsEnum(AdminStatus)
  @IsNotEmpty()
  status: AdminStatus;

  @ApiProperty({
    description: 'Fecha de inicio de la transaccion',
    example: '2021-01-01:00:00:00',
  })
  @IsOptional()
  @IsDateString()
  beginTransaction?: Date;

  @ApiProperty({
    description: 'Fecha de fin de la transaccion',
    example: '2021-02-01:12:00:00',
  })
  @IsOptional()
  @IsDateString()
  endTransaction?: Date;

  @ApiProperty({ description: 'ID de la transaccion recibida', example: '123' })
  @IsOptional()
  @IsString()
  transferReceived?: string;
}
