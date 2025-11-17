import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class DeleteBankAccountDto {
  @IsUUID()
  @ApiProperty({ example: 'uuid-de-la-cuenta' })
  userAccountId: string;
}
