import { PartialType } from '@nestjs/mapped-types';
import { CreateTransactionDetailDto } from './create-transaction-detail.dto';

export class UpdateTransactionDetailDto extends PartialType(CreateTransactionDetailDto) {}
