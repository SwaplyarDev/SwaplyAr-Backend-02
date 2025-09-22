import { IsUUID } from 'class-validator';

export class DeleteBankAccountDto {
  @IsUUID()
  userAccountId: string;
}
