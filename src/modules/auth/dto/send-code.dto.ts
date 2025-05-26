import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class SendCodeDto {
  @IsEmail()
  @IsNotEmpty()
  @IsString()
  email: string;
}
