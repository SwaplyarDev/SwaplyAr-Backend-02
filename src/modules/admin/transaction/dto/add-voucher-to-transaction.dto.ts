import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class AddVoucherTransactionDto {
  @ApiProperty({
    description: 'ID de la transacción a la que se asocia el comprobante.',
    example: 'b6a8c2f0-7d5b-4a5d-b2d4-3d11a2fdf879',
  })
  @IsNotEmpty()
  @IsString()
  transactionId: string;
}
