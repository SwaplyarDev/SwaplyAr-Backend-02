import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';  

export class SendCodeDto {
  @ApiProperty({ description: 'Email del usuario' , example: 'nahuel@gmail.com'})
  @IsEmail()
  @IsNotEmpty()
  @IsString()
  email: string;
}
