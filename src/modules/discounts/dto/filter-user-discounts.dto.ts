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
      "Filtrado por disponibilidad del descuento ('all' | 'used' | 'available'). Por defecto 'all'.",
    enum: FilterTypeEnum,
    default: FilterTypeEnum.ALL,
  })
  @IsOptional()
  @IsEnum(FilterTypeEnum)
  filterType?: FilterTypeEnum = FilterTypeEnum.ALL;
}
