import { IsOptional, IsEnum } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export enum FilterTypeEnum {
  ALL = 'all',
  USED = 'used',
  AVAILABLE = 'available',
}

export class FilterUserDiscountsDto {
  @ApiPropertyOptional({
    description:
      "Filtrado por disponibilidad del descuento ('all' | 'used' | 'available'). Si no se envía, se toma 'all' por defecto.",
    enum: FilterTypeEnum,
    default: FilterTypeEnum.ALL,
  })
  @IsOptional()
  @IsEnum(FilterTypeEnum, {
    message: "filterType debe ser 'all', 'used' o 'available'",
  })
  filterType?: FilterTypeEnum = FilterTypeEnum.ALL;
}
