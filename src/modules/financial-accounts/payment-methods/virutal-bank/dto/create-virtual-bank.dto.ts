import { ApiProperty } from '@nestjs/swagger';
import { IsEmpty, IsString } from 'class-validator';

export class CreateVirtualBankDto {
  @ApiProperty({ description: 'Moneda', example: 'ARS' })
  @IsString()
  @IsEmpty()
  currency: string;
  
  @ApiProperty({ description: 'Email de la cuenta', example: 'nahuel@gmail.com',})
  @IsString()
  @IsEmpty()
  emailAccount: string;

  @ApiProperty({ description: 'Codigo de transferencia', example: '123' })
  @IsString()
  @IsEmpty()
  transferCode: string;
}
