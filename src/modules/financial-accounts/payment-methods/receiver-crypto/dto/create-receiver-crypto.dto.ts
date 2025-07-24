import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateReceiverCryptoDto {
  @IsString()
  @ApiProperty({ description: 'Moneda', example: 'ARS' })
  currency: string;

  @IsString()
  @ApiProperty({ description: 'Red', example: 'ARS' })
  network: string;

  @IsString()
  @ApiProperty({ description: 'Wallet', example: 'ARS' })
  wallet: string;

}
