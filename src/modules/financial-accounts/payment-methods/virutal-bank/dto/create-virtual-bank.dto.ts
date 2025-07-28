import { ApiProperty } from '@nestjs/swagger';
import { IsEmpty, IsNotEmpty, IsString } from 'class-validator';

export class CreateVirtualBankDto {
  @ApiProperty({ description: 'Moneda', example: 'ARS' })
  @IsString()
  @IsNotEmpty()
  currency: string;
  
  @ApiProperty({ description: 'Email de la cuenta', example: 'nahuel@gmail.com',})
  @IsString()
  @IsNotEmpty()
  emailAccount: string;

  @ApiProperty({ description: 'Codigo de transferencia', example: '123' })
  @IsString()
  @IsNotEmpty()
  transferCode: string;
}
