import { CreatePaymentMethodDto } from '@financial-accounts/payment-methods/dto/create-payment-method.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsString, ValidateNested, IsOptional, IsEmail } from 'class-validator';

export class CreateSenderFinancialAccountDto {
  @ApiProperty({ description: 'Nombre del usuario', example: 'Nahuel' })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ description: 'Apellido del usuario', example: 'Davila' })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({ description: 'Correo electrónico', example: 'nahuel@example.com', required: false })
  @IsEmail()
  @IsString()
  @IsOptional()
  createdBy: string;

  @ApiProperty({ description: 'Número de teléfono', example: '1122334455', required: false })
  @IsString()
  @IsOptional()
  phoneNumber?: string;


  @ApiProperty()
  @ValidateNested()
  @Type(() => CreatePaymentMethodDto)
  paymentMethod: CreatePaymentMethodDto;
}
