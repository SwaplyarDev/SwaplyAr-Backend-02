import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { BankAccountResponseDto } from 'src/modules/payments/accounts/bank-accounts/dto/bank-accounts-response.dto';

export class CreateUserAccountDto {
  @IsString()
  @IsNotEmpty()
  platformId: string;

  @IsString()
  @IsNotEmpty()
  method: string;

  bank: BankAccountResponseDto;

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
