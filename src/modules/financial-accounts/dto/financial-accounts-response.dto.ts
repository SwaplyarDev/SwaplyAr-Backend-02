import { ApiProperty } from '@nestjs/swagger';
import { UserResponseDto } from '@users/dto/user-response.dto';
import { Expose, Type } from 'class-transformer';
import { PaymentPlatformDto } from 'src/modules/payments/dtos/payment-platform-response.dto';

export class FinancialAccountResponseDto {
  @ApiProperty({ example: '29e11aa2-4f5f-45c4-aac9-52da305c5313' })
  @Expose({ name: 'financialAccountId' })
  financialAccountId: string;

  @ApiProperty({ type: PaymentPlatformDto })
  @Expose()
  @Type(() => PaymentPlatformDto)
  paymentPlatform: PaymentPlatformDto;

  @ApiProperty({
    example: 'bank_account',
    description: 'Tipo de referencia (bank_account, wallet, etc.)',
  })
  @Expose()
  reference_type: string;

  @ApiProperty({
    example: '6b04e1ea-5c9b-4e8e-bc46-a21ff48f1d93',
    description: 'ID real de la cuenta en el sistema (bank_account_id, wallet_id)',
  })
  @Expose()
  referenceId: string;

  @ApiProperty({
    example: '7d91fae0-3e47-4a25-9c43-b76f9a0a6dbc',
    nullable: true,
  })
  @Expose()
  userId: string | null;

  @ApiProperty({
    example: 'user',
  })
  @Expose()
  ownerType: string;

  @ApiProperty({ type: UserResponseDto })
  @Expose()
  @Type(() => UserResponseDto)
  createdBy: UserResponseDto;

  @ApiProperty({ example: '2025-01-10T13:45:00.000Z' })
  @Expose()
  createdAt: Date;

  @ApiProperty({ example: '2025-01-10T13:45:00.000Z' })
  @Expose()
  updatedAt: Date;
}
