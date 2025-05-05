import { PartialType } from '@nestjs/mapped-types';
import { CreatePaymentAccountDto } from './create-payment-account.dto';

export class UpdatePaymentAccountDto extends PartialType(CreatePaymentAccountDto) {}
