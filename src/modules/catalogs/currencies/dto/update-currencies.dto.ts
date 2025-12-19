import { PartialType } from '@nestjs/swagger';
import { CreateCurrencyDto } from './create-currencies.dto';

export class UpdateCurrencyDto extends PartialType(CreateCurrencyDto) {}
