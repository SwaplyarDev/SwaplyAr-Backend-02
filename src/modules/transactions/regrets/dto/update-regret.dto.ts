import { PartialType } from '@nestjs/mapped-types';
import { CreateRegretDto } from './create-regret.dto';
 
export class UpdateRegretDto extends PartialType(CreateRegretDto) {} 