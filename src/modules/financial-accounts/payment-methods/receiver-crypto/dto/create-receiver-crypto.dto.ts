import { ApiProperty } from '@nestjs/swagger';

export class CreateReceiverCryptoDto {
  @ApiProperty({ description: 'Moneda', example: 'ARS' })
  currency: string;
  @ApiProperty({ description: 'Red', example: 'ARS' })
  network: string;
  @ApiProperty({ description: 'Wallet', example: 'ARS' })
  wallet: string;
}
