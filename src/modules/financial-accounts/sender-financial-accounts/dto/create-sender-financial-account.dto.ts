import { IsPhoneNumberValid } from '@common/decorators/phone-number.decorator';
import { CreatePaymentMethodDto } from '@financial-accounts/payment-methods/dto/create-payment-method.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsString, ValidateNested, IsEmail } from 'class-validator';

export class CreateSenderFinancialAccountDto {
  @ApiProperty({ description: 'Nombre del usuario', example: 'Nahuel' })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ description: 'Apellido del usuario', example: 'Davila' })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({
    description: 'Correo electrónico',
    example: 'nahuel@example.com',
    required: true,
  })
  @IsEmail()
  @IsNotEmpty()
  createdBy: string;

  @ApiProperty({
    description: 'Número de teléfono en formato internacional. Ej: +56912345678',
    example: '+573001234567',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @IsPhoneNumberValid({
    message: 'Número inválido según su código de país. Use formato +<código_pais><numero>.',
  })
  phoneNumber: string;

  @ApiProperty()
  @ValidateNested()
  @Type(() => CreatePaymentMethodDto)
  paymentMethod: CreatePaymentMethodDto;
}
