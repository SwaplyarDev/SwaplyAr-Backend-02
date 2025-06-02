import { IsString } from 'class-validator';

export class ValidateNoteCodeDto {
  @IsString()
  transaction_id: string;
 
  @IsString()
  code: string;
} 