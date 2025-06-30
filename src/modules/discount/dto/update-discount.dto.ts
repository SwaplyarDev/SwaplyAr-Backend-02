import { IsString } from 'class-validator';

export class UpdateDiscountDto {
  @IsString()
  discountId: string;

  @IsString()
  transactionId: string;

  @IsString()
  userId: string; // Este campo técnicamente viene del token, pero lo validamos igual si llega por otro lado
}
