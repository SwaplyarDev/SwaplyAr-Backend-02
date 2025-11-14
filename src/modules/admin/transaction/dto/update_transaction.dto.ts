import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsBoolean, IsDateString, IsEnum } from 'class-validator';
import { Status } from 'src/enum/status.enum';

export class UpdateTransactionPayloadDto {
  @ApiProperty({
    description: 'Mensaje asociado a la transacción',
    example: 'Actualización de prueba desde Swagger',
  })
  @IsOptional()
  @IsString()
  message?: string;

  @ApiProperty({ description: 'Indica si la nota fue verificada', example: true })
  @IsOptional()
  @IsBoolean()
  isNoteVerified?: boolean;

  @ApiProperty({
    description: 'Fecha de expiración de la verificación de la nota',
    example: '2025-11-01T00:00:00.000Z',
  })
  @IsOptional()
  @IsDateString()
  noteVerificationExpiresAt?: string;

  @ApiProperty({
    description: 'Estado final de la transacción',
    example: 'approved',
    enum: Status,
  })
  @IsOptional()
  @IsEnum(Status)
  finalStatus?: Status;
}
