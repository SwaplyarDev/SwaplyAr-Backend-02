import { PartialType } from '@nestjs/swagger';
import { CreateBankAccountDto } from './create-bank-accounts.dto';

export class UpdateBankAccountDto extends PartialType(CreateBankAccountDto) {}
