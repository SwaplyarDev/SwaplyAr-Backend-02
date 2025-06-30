import { IsString, IsIn } from 'class-validator';
import { DiscountTypeEnum } from '@discount/enum/discount-type.enum';

export class CreateDiscountDto {
  @IsString()
  @IsIn([
    DiscountTypeEnum.REGISTERED,
    DiscountTypeEnum.VERIFIED,
    DiscountTypeEnum.COMPLETED,
  ])
  typeCode: DiscountTypeEnum;

  @IsString()
  userId: string;
}
