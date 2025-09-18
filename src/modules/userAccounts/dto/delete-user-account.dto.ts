import { IsUUID } from 'class-validator';

export class DeleteBankAccountDto {
  @IsUUID()
  AccountId: string;
}
