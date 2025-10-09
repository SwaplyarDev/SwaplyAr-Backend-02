import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { ConversionRequestDto } from './conversions-request.dto';
import { ArsOperationType } from '../../../enum/ars-operation-type.enum';

export class ConversionArsRequestDto extends ConversionRequestDto {
  @ApiProperty({
    example: ArsOperationType.Compra,
    description: 'Tipo de operación en pesos argentinos (compra o venta)',
    enum: ArsOperationType,
  })
  @IsEnum(ArsOperationType)
  operationType: ArsOperationType;
}
