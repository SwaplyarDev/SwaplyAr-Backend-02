import { PartialType } from '@nestjs/mapped-types';
import { CreateAmountDto } from './create-amount.dto';
import { IsNumber, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateAmountDto extends PartialType(CreateAmountDto) {}

