import { CreatePaymentMethodDto } from "@financial-accounts/payment-methods/dto/create-payment-method.dto";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateUserAccountDto extends CreatePaymentMethodDto {
  @IsString()
  @IsNotEmpty() // Es buena práctica asegurar que no venga vacío
  accountName: string;

  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;
}