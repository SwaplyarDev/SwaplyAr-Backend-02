import { IsString } from 'class-validator';

export class UpdatePhoneDto {
  @IsString()
  phone: string;
}
