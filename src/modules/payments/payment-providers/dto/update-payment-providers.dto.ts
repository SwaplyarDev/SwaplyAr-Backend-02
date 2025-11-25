import { CreatePaymentProvidersDto } from './create-payment-providers.dto';
import { PartialType } from '@nestjs/swagger';

export class UpdatePaymentProvidersDto extends PartialType(CreatePaymentProvidersDto) {}
