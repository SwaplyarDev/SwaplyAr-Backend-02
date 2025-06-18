import { CreatePaymentMethodDto } from '@financial-accounts/payment-methods/dto/create-payment-method.dto';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSenderFinancialAccountDto {
  @ApiProperty({ description: 'Nombre del usuario' , example: 'Nahuel'})
  firstName: string;  
  @ApiProperty({ description: 'Apellido del usuario' , example: 'Davila'})
  lastName: string;
  @ApiProperty({ description: 'Metodo de pago' , example: '123'})
  paymentMethod: CreatePaymentMethodDto;
}
