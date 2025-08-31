import { PartialType } from '@nestjs/mapped-types';
import { CreateSenderFinancialAccountDto } from './create-sender-financial-account.dto';

export class UpdateSenderFinancialAccountDto extends PartialType(CreateSenderFinancialAccountDto) {}
