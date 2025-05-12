import { CreatePaymentMethodDto } from "@financial-accounts/payment-methods/dto/create-payment-method.dto";

export class CreateSenderFinancialAccountDto {
    firstName: string;
    lastName: string;
    identificationNumber: string;
    phoneNumber: string;
    email: string;
    paymentMethod: CreatePaymentMethodDto;
}
