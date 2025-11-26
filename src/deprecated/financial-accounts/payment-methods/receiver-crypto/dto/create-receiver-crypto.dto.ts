import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateReceiverCryptoDto {
  @ApiProperty({ description: 'Moneda', example: 'ARS' })
  @IsString()
  @IsNotEmpty()
  currency: string;

  @ApiProperty({ description: 'Red', example: 'ARS' })
  @IsString()
  @IsNotEmpty()
  network: string;

  @ApiProperty({ description: 'Wallet', example: 'ARS' })
  @IsString()
  @IsNotEmpty()
  wallet: string;
}
