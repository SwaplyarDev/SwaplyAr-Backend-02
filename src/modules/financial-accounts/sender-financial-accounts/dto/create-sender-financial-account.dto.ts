import { CreatePaymentMethodDto } from '@financial-accounts/payment-methods/dto/create-payment-method.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsString, ValidateNested } from 'class-validator';

export class CreateSenderFinancialAccountDto {
  @ApiProperty({ description: 'Nombre del usuario', example: 'Nahuel' })
  @IsString()
  firstName: string;

  @ApiProperty({ description: 'Apellido del usuario', example: 'Davila' })
  @IsString()
  lastName: string;

  @ApiProperty()
  @ValidateNested()
  @Type(() => CreatePaymentMethodDto)
  paymentMethod: CreatePaymentMethodDto;
}
