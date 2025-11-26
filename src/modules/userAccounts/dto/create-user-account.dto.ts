import { CreatePaymentMethodDto } from 'src/deprecated/financial-accounts/payment-methods/dto/create-payment-method.dto';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateUserAccountDto extends CreatePaymentMethodDto {
  @IsString()
  @IsNotEmpty()
  accountName: string;

  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;
}
