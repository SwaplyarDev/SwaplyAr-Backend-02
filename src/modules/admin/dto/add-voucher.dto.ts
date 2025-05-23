import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class AddVoucherDto {
  @IsNotEmpty()
  @IsString()
  transactionId: string;

  @IsOptional()
  @IsString()
  comprobante?: string; // Puede ser base64 o URL
}
