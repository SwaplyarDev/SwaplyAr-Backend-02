import { PartialType, OmitType } from '@nestjs/swagger';
import { CreateBankAccountDto } from './create-bank-accounts.dto';

export class UpdateBankAccountDto extends PartialType(
  OmitType(CreateBankAccountDto, ['details'] as const),
) {}
