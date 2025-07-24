import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateVirtualBankDto {
  @IsString()
  @ApiProperty({ description: 'Moneda', example: 'ARS' })
  currency: string;
  
  @IsString()
  @ApiProperty({
    description: 'Email de la cuenta',
    example: 'nahuel@gmail.com',
  })
  emailAccount: string;

  @IsString()
  @ApiProperty({ description: 'Codigo de transferencia', example: '123' })
  transferCode: string;
}
