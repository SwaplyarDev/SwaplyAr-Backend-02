import { CreatePaymentProvidersDto } from './create-payment-providers.dto';
import { UpdatePaymentPlatformsDto } from '../../payment-platforms/dto/update-payment-platforms.dto';
import { PartialType, OmitType } from '@nestjs/swagger';
import { IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdatePaymentProvidersDto extends PartialType(
  OmitType(CreatePaymentProvidersDto, ['paymentPlatform']),
) {
  @ValidateNested()
  @Type(() => UpdatePaymentPlatformsDto)
  @IsOptional()
  paymentPlatform?: UpdatePaymentPlatformsDto;
}
