import { CreatePaymentMethodDto } from '@financial-accounts/payment-methods/dto/create-payment-method.dto';

export class CreateReceiverFinancialAccountDto {
  firstName: string;
  lastName: string;
  document_value: string;
  phoneNumber: string;
  email: string;
  paymentMethod: CreatePaymentMethodDto;
  bank_name: string;
}
