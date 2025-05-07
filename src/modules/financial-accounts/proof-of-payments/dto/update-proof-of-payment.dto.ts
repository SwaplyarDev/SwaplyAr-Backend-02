import { PartialType } from '@nestjs/mapped-types';
import { CreateProofOfPaymentDto } from './create-proof-of-payment.dto';

export class UpdateProofOfPaymentDto extends PartialType(
  CreateProofOfPaymentDto,
) {}
