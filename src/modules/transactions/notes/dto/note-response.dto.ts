import { ApiProperty } from '@nestjs/swagger';
import { TransactionResponseDto } from '@transactions/dto/transaction-response.dto';
import { Expose } from 'class-transformer';

export class NoteResponseDto {
  @Expose()
  id: string; // note_id

  @Expose()
  message: string;

  @Expose()
  createdAt: Date;

  @Expose()
  @ApiProperty({ type: () => TransactionResponseDto })
  transaction: TransactionResponseDto;

  @Expose()
  attachments: string[]; // text[]

  @Expose()
  section: string;
}
