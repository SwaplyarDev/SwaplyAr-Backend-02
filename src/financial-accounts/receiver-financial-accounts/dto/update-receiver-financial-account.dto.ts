import { PartialType } from '@nestjs/mapped-types';
import { CreateReceiverFinancialAccountDto } from './create-receiver-financial-account.dto';

export class UpdateReceiverFinancialAccountDto extends PartialType(CreateReceiverFinancialAccountDto) {}
