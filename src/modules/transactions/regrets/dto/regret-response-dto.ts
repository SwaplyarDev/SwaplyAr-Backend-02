import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { ProofOfPaymentResponseDto } from '@transactions/dto/transaction-response.dto';
import { TransactionResponseDto } from '@transactions/dto/transaction-response.dto';

export class RegretDto {
  @Expose()
  @ApiProperty({ example: '375c0ae0-6f94-47f9-9585-a7bfa4f5f57c' })
  id: string;

  @Expose({ name: 'last_name' })
  @ApiProperty({ example: 'Pérez' })
  lastName: string;

  @Expose()
  @ApiProperty({ example: 'perez@gmail.com' })
  email: string;

  @Expose({ name: 'phone_number' })
  @ApiProperty({ example: '+12456789' })
  phoneNumber: string;

  @Expose()
  @ApiProperty({ example: 'Descripción de prueba' })
  description: string;

  @Expose()
  @ApiProperty({ type: () => TransactionResponseDto })
  transaction: TransactionResponseDto;

  @Expose({ name: 'proofsOfPayment' })
  @ApiProperty({ type: () => ProofOfPaymentResponseDto, required: false })
  proofOfPayment?: ProofOfPaymentResponseDto;

  @Expose()
  @ApiProperty({ example: '2025-01-10T13:45:00.000Z' })
  createdAt: Date;

  @Expose()
  @ApiProperty({ example: '2025-01-10T13:45:00.000Z' })
  updatedAt: Date;
}
