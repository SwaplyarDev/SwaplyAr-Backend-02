import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ValidateNoteCodeDto {
  @ApiProperty({ description: 'ID de la transaccion' , example: '123'})
  @IsString()
  transaction_id: string;
 
  @IsString()
  @ApiProperty({ description: 'Codigo de la nota' , example: '123'})
  code: string;
} 