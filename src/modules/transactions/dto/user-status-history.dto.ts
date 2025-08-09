import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsString,
  IsArray,
  IsDate,
  ValidateNested,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class StatusHistoryItemDto {
  @ApiProperty({
    description: 'Identificador único del registro de historial',
    example: 'c4b1f279-70a8-42c5-90d7-56a76feb2e2d',
  })
  @IsString()
  id: string;

  @ApiProperty({
    description: 'Estado actual de la transacción',
    example: 'review_payment',
  })
  @IsString()
  status: string;

  @ApiProperty({
    description: 'Fecha y hora en que se realizó el cambio de estado',
    example: '2025-08-08T17:02:04.584Z',
    type: String,
    format: 'date-time',
  })
  @IsDate()
  @Type(() => Date)
  changedAt: Date;

  @ApiProperty({
    description: 'Mensaje o descripción asociada al cambio de estado',
    example: 'Aprobación automática tras revisión',
  })
  @IsString()
  message: string;
}

export class UserStatusHistoryResponseDto {
  @ApiProperty({
    description: 'Indica si la operación fue exitosa',
    example: true,
  })
  @IsBoolean()
  success: boolean;

  @ApiProperty({
    description: 'Mensaje informativo sobre el resultado',
    example: 'Historial obtenido correctamente',
  })
  @IsString()
  message: string;

  @ApiProperty({
    description: 'Lista con los registros del historial de estados',
    type: [StatusHistoryItemDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => StatusHistoryItemDto)
  data: StatusHistoryItemDto[];
}
