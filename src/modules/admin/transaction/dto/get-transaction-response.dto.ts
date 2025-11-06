import { ApiProperty } from '@nestjs/swagger';
import { TransactionGetResponseDto } from '@transactions/dto/transaction-response.dto';
import { Expose, Type } from 'class-transformer';

class NoteDto {
  @Expose()
  @ApiProperty({
    name: 'note_id',
    example: '8422324d-3c49-4a2c-899a-6866033e2aac',
    required: false,
  })
  note_id: string;
}

class NoteDetailsDto extends NoteDto {
  // Extending NoteIdDto to reuse the note_id property
  @Expose()
  @ApiProperty({
    example: [
      'https://res.cloudinary.com/dy1jiclwg/image/upload/...',
      'https://res.cloudinary.com/dy1jiclwg/image/upload/...',
    ],
    description: 'Array of URLs to the files associated with the note (optional).',
    required: false,
    type: [String],
  })
  attachments?: string[];

  @Expose()
  @ApiProperty({
    example: 'Pago recibido correctamente',
    description: 'Message content of the note (optional).',
    required: false,
  })
  message?: string;

  @Expose()
  @ApiProperty({
    example: 'datos_envio, datos_recepcion, monto',
    description: 'Section of the transaction being modified (datos_envio, datos_recepcion, monto).',
    required: false,
  })
  section?: string;

  @Expose()
  @ApiProperty({
    example: '2025-08-19T12:53:15.531Z',
    description: 'Timestamp when the note was created (optional).',
    required: false,
  })
  createdAt?: string;
}

export class TransactionAdminResponseDto extends TransactionGetResponseDto {
  @Expose()
  @Type(() => NoteDto)
  @ApiProperty({ name: 'note', type: NoteDto, required: false })
  note?: NoteDto;

  @Expose()
  @ApiProperty({ example: true })
  isNoteVerified: boolean;

  @Expose()
  @ApiProperty({
    name: 'noteVerificationExpiresAt',
    example: '2025-08-19T12:57:56.171Z',
    required: false,
  })
  noteVerificationExpiresAt?: string;
}

export class TransactionByIdAdminResponseDto extends TransactionGetResponseDto {
  @Expose()
  @Type(() => NoteDto)
  @ApiProperty({ name: 'note', type: NoteDto, required: false })
  note?: NoteDetailsDto;

  @Expose()
  @ApiProperty({ example: true })
  isNoteVerified: boolean;

  @Expose()
  @ApiProperty({
    name: 'noteVerificationExpiresAt',
    example: '2025-08-19T12:57:56.171Z',
    required: false,
  })
  noteVerificationExpiresAt?: string;
}
