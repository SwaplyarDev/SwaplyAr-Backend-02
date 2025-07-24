import { CreatePaymentMethodDto } from '@financial-accounts/payment-methods/dto/create-payment-method.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ValidateNested,
  IsString,
  IsEmail,
} from 'class-validator';

export class CreateReceiverFinancialAccountDto {
  @ApiProperty({ description: 'Nombre del usuario', example: 'Nahuel' })
  @IsString()
  firstName: string;

  @ApiProperty({ description: 'Apellido del usuario', example: 'Davila' })
  @IsString()
  lastName: string;

  @ApiProperty({ description: 'Documento del usuario', example: '123' })
  @IsString()
  document_value: string;

  @ApiProperty({ description: 'Telefono del usuario', example: '1234567890' })
  @IsString()
  phoneNumber: string;

  @ApiProperty({
    description: 'Email del usuario',
    example: 'nahuel@gmail.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty()
  @ValidateNested()
  @Type(() => CreatePaymentMethodDto)
  paymentMethod: CreatePaymentMethodDto;

  @ApiProperty({ description: 'Nombre del banco', example: 'Banco Galicia' })
  @IsString()
  bank_name: string;
}
