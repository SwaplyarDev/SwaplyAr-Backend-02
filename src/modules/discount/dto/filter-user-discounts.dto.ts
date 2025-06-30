import { IsOptional, IsString, IsIn } from 'class-validator';
import { FilterTypeEnum } from '../enum/filter-type.enum';

export class FilterUserDiscountsDto {
  @IsOptional()
  @IsIn([FilterTypeEnum.ALL, FilterTypeEnum.USED, FilterTypeEnum.AVAILABLE])
  filterType?: FilterTypeEnum = FilterTypeEnum.ALL;

  @IsOptional()
  @IsString()
  userId?: string;
}
