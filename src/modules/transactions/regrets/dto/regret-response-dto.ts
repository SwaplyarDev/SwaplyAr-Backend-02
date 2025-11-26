import { ApiProperty } from '@nestjs/swagger';
import {
  ProofOfPaymentResponseDto,
  TransactionResponseDto,
} from '@transactions/dto/transaction-response.dto';
import { Expose } from 'class-transformer';

export class RegretDto {
  @Expose()
  @ApiProperty({ example: '375c0ae0-6f94-47f9-9585-a7bfa4f5f57c' })
  id: string;

  @Expose()
  @ApiProperty({ example: 'Pérez' })
  lastName: string;

  @Expose()
  @ApiProperty({ example: 'perez@gmail.com' })
  email: string;

  @Expose()
  @ApiProperty({ example: '+12456789' })
  phoneNumber: string;

  @Expose()
  @ApiProperty({ example: 'Descripción de prueba' })
  description: string;

  @Expose()
  @ApiProperty({ type: TransactionResponseDto })
  transaction: TransactionResponseDto;

  @Expose()
  @ApiProperty({ type: TransactionResponseDto })
  paymentInfo: ProofOfPaymentResponseDto;

  @Expose()
  @ApiProperty({ example: '2025-01-10T13:45:00.000Z' })
  createdAt: Date;

  @Expose()
  @ApiProperty({ example: '2025-01-10T13:45:00.000Z' })
  updatedAt: Date;
}
