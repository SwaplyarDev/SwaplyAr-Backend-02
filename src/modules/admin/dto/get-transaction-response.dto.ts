import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { TransactionGetResponseDto } from '../../transactions/dto/transaction-response.dto';

class NoteDto {
  @Expose()
  @ApiProperty({ name: 'note_id', example: '8422324d-3c49-4a2c-899a-6866033e2aac', required: false})
  note_id: string;
}

class RegretDto{
  @Expose()
  @ApiProperty({ name: 'id', example: 'e3b4c4b0-9c1e-4e6a-8c5a-4d3a5b6c7d8a', required: false})
  regret_id: string
}

class NoteDetailsDto extends NoteDto { // Extending NoteIdDto to reuse the note_id property
  @Expose()
  @ApiProperty({
    example: 'https://res.cloudinary.com/dy1jiclwg/image/upload/...',
    description: 'URL to the image associated with the note (optional).',
    required: false,
  })
  img_url?: string;

  @Expose()
  @ApiProperty({
    example: 'Pago recibido correctamente',
    description: 'Message content of the note (optional).',
    required: false,
  })
  message?: string;

  @Expose()
  @ApiProperty({
    example: '2025-08-19T12:53:15.531Z',
    description: 'Timestamp when the note was created (optional).',
    required: false,
  })
  createdAt?: string;
}

class RegretDetailsDto extends RegretDto{
  @Expose()
  @ApiProperty({
    example: 'Perez',
    description: 'Last name of the regret (optional).',
    required: false,
  })
  last_name?: string;

  @Expose()
  @ApiProperty({
    example: 'perez@gmail.com',
    description: 'Email of the regret (optional).',
    required: false,
  })
  email?: string;

  @Expose()
  @ApiProperty({
    example: '123456789',
    description: 'Phone number of the regret (optional).',
    required: false,
  })
  phone_number?: string;

  @Expose()
  @ApiProperty({
    example: 'Transferencia bancaria rechazada',
    description: 'Description of the regret (optional).',
    required: false,
  })
  description?: string;
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
@ApiProperty({ name: 'noteVerificationExpiresAt', example: '2025-08-19T12:57:56.171Z', required: false })
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
  @ApiProperty({ name: 'noteVerificationExpiresAt', example: '2025-08-19T12:57:56.171Z', required: false })
  noteVerificationExpiresAt?: string;


  @Expose()
  @Type(() => RegretDto)
  @ApiProperty({ name: 'regret', type: RegretDto, required: false })
  regret?: RegretDetailsDto

}


