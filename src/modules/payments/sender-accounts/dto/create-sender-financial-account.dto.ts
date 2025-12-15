import { IsPhoneNumberValid } from '@common/decorators/phone-number.decorator';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { CreatePaymentProvidersDto } from '../../payment-providers/dto/create-payment-providers.dto';

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
    description: 'Correo electrónico del usuario dueño de la cuenta',
    example: 'nahuel@example.com',
    required: true,
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'Número de teléfono en formato internacional. Ej: +56912345678',
    example: '+573001234567',
    required: false,
  })
  @IsString()
  @IsOptional()
  @IsPhoneNumberValid({
    message: 'Número inválido según su código de país. Use formato +<código_pais><numero>.',
  })
  phoneNumber?: string;

  @ApiProperty({
    type: CreatePaymentProvidersDto,
  })
  paymentProvider: CreatePaymentProvidersDto;

  @ApiProperty({
    description: 'Código del país (opcional)',
    example: 'CO',
    required: false,
  })
  @IsString()
  @IsOptional()
  countryCode?: string;
}
