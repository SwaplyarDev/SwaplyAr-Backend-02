import { IsNotEmpty, IsUUID } from 'class-validator';

export class AddVoucherDto {
  @IsUUID()
  @IsNotEmpty()
  transactionId: string;
}
