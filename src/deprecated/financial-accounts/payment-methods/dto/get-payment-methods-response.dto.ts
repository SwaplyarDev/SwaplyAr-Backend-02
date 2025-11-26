import { ApiProperty } from '@nestjs/swagger';

export class PaymentBankDataDto {}

export class PaymentMethodsResponseDto {
  @ApiProperty({ example: 'uuid' })
  id: string;

  @ApiProperty({ example: 'bank' })
  platformId: string;

  @ApiProperty({ example: 'bank' })
  method: string;

  @ApiProperty({ type: PaymentBankDataDto })
  bank: PaymentBankDataDto;
}
