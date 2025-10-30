import { IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { AdminStatus } from 'src/enum/admin-status.enum';

export class UpdateStatusDto {
  @ApiProperty({ description: 'ID de la transaccion', example: '1234567890' })
  @IsUUID()
  @IsNotEmpty()
  transactionId: string;
}

export class AdditionalDataDto {
  @ApiProperty({ description: 'Motivo de actualización', example: 'Verificación completa' })
  @IsString()
  motivo: string;

  @ApiProperty({ description: 'Observaciones de actualización', example: 'Sin observaciones' })
  @IsString()
  notas: string;
}

export class UpdateStatusByIdDto {
  @ApiProperty({
    description: 'Estado administrativo de la transacción',
    example: AdminStatus.Approved,
    enum: Object.values(AdminStatus),
  })
  @IsString()
  @IsNotEmpty()
  status: string;

  @ApiProperty({
    description: 'Mensaje opcional relacionado al cambio de estado',
    example: 'Aprobación automática tras revisión',
  })
  @IsString()
  message: string;

  @ApiProperty({
    description: 'Datos adicionales que pueden acompañar el cambio de estado',
    type: AdditionalDataDto,
  })
  additionalData: AdditionalDataDto;
}
