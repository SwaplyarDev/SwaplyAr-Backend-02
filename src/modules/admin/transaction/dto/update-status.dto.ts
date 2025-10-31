import { IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { AdminStatus } from 'src/enum/admin-status.enum';

export class UpdateStatusDto {
  @ApiProperty({ description: 'ID de la transaccion', example: '1234567890' })
  @IsUUID()
  @IsNotEmpty()
  transactionId: string;
}

export class DataDto {}

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
    type: () => AdditionalDataDto,
  })
  additionalData: AdditionalDataDto;
}

export class UpdateStatusByTypeDto {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({
    description: 'Mensaje opcional relacionado al cambio de estado',
    example:
      'Estado cambiado a completed y se asignaron recompensas. ¡Felicidades! Completaste un ciclo y se ha generado tu cupón PLUS REWARDS. Código: PLUS-W50TNX, Válido desde: 17/10/2025, Valor: 10 USD.',
  })
  message: string;

  @ApiProperty({
    description: 'Datos adicionales que pueden acompañar el cambio de estado',
    type: () => DataDto,
  })
  data: DataDto;
}

export class UpdateTransactionRecipientDto extends UpdateStatusByTypeDto {
  @ApiProperty({
    description: 'Mensaje opcional relacionado al resultado de la actualización de una transacción',
    example: 'Transacción actualizada correctamente',
  })
  declare message: string;
}
