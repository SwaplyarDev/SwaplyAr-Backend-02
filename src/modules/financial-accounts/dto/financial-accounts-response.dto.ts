import { ApiProperty } from '@nestjs/swagger';
import { UserResponseDto } from '@users/dto/user-response.dto';
import { Expose, Type } from 'class-transformer';
import { PaymentPlatformDto } from 'src/modules/payments/dto/payment-platform-response.dto';

export class FinancialAccountResponseDto {
  @ApiProperty({ example: '29e11aa2-4f5f-45c4-aac9-52da305c5313' })
  @Expose()
  id: string;

  @ApiProperty({ type: PaymentPlatformDto })
  @Expose()
  @Type(() => PaymentPlatformDto)
  paymentPlatform: PaymentPlatformDto;

  @ApiProperty({
    example: '6b04e1ea-5c9b-4e8e-bc46-a21ff48f1d93',
    description: 'Referencia a la cuenta real (bank_account_id, etc.)',
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
