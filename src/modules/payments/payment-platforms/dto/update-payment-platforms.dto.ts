import { PartialType } from '@nestjs/swagger';
import { CreatePaymentPlatformsDto } from './create-payment-platforms.dto';

export class UpdatePaymentPlatformsDto extends PartialType(CreatePaymentPlatformsDto) {}
