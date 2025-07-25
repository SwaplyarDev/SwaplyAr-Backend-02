import { ApiProperty } from '@nestjs/swagger';
import { IsEmpty, IsString } from 'class-validator';

export class CreateReceiverCryptoDto {
  @ApiProperty({ description: 'Moneda', example: 'ARS' })
  @IsString()
  @IsEmpty()
  currency: string;

  @ApiProperty({ description: 'Red', example: 'ARS' })
  @IsString()
  @IsEmpty()
  network: string;

  @ApiProperty({ description: 'Wallet', example: 'ARS' })
  @IsString()
  @IsEmpty()
  wallet: string;

}
