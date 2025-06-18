import { CreatePaymentMethodDto } from '@financial-accounts/payment-methods/dto/create-payment-method.dto';
import { ApiProperty } from '@nestjs/swagger';

export class CreateReceiverFinancialAccountDto {
  @ApiProperty({ description: 'Nombre del usuario' , example: 'Nahuel'})
  firstName: string;
  @ApiProperty({ description: 'Apellido del usuario' , example: 'Davila'})
  lastName: string;
  @ApiProperty({ description: 'Documento del usuario' , example: '123'})
  document_value: string;
  @ApiProperty({ description: 'Telefono del usuario' , example: '1234567890'})
  phoneNumber: string;
  @ApiProperty({ description: 'Email del usuario' , example: 'nahuel@gmail.com'})
  email: string;
  @ApiProperty({ description: 'Metodo de pago' , example: '123'})
  paymentMethod: CreatePaymentMethodDto;
  @ApiProperty({ description: 'Nombre del banco' , example: '123'})
  bank_name: string;
}
