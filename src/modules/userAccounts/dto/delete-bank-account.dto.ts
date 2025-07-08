import { IsUUID } from 'class-validator';

export class DeleteBankAccountDto {
  @IsUUID()
  bankAccountId: string;
}
