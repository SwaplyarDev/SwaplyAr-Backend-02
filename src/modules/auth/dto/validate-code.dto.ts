import {
  IsEmail,
  IsNotEmpty,
  IsNumberString,
  IsString,
  Length,
} from 'class-validator';

export class ValidateCodeDto {
  @IsEmail()
  @IsNotEmpty()
  @IsString()
  email: string;

  @Length(6, 6)
  @IsNumberString({ no_symbols: true })
  @IsString()
  code: string;
}
