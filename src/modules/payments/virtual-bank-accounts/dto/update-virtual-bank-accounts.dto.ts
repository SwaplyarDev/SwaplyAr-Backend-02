import { PartialType } from '@nestjs/swagger';
import { CreateVirtualBankAccountDto } from './create-virtual-bank-accounts.dto';

export class UpdateVirtualBankAccountDto extends PartialType(CreateVirtualBankAccountDto) {}
