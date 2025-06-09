import { IsNotEmpty, IsUUID } from 'class-validator';

export class UpdateStatusDto {
  @IsUUID()
  @IsNotEmpty()
  transactionId: string;
}
