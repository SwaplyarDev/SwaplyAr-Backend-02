import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { SendCodeDto } from '@auth/dto/send-code.dto';
import { UsersService } from '@users/users.service';
import { MailerService } from '@mailer/mailer.service';
import { AuthService } from '@auth/auth.service';
import { ValidateCodeDto } from '@auth/dto/validate-code.dto';

@Controller('login')
export class AuthController {
  constructor(
    private usersService: UsersService,
    private mailService: MailerService,
    private authService: AuthService,
  ) {}

  @Post('/email/send')
  @HttpCode(HttpStatus.OK)
  async sendOtpCode(@Body() sendCodeDto: SendCodeDto) {
    const user = await this.usersService.findByEmail(sendCodeDto.email);
    if (!user) {
      throw new BadRequestException(
        'Email address not associated with any account',
      );
    }

    const otpCode = await this.authService.createOtpCode(user);
    return this.mailService.sendAuthCodeMail(user.profile.email, otpCode.code);
  }

  @Post('/email/validate')
  @HttpCode(HttpStatus.OK)
  async validateOtpCode(@Body() validateCodeDto: ValidateCodeDto) {
    const user = await this.usersService.findByEmail(validateCodeDto.email);
    if (!user) {
      throw new BadRequestException(
        'Email address not associated with any account',
      );
    }

    const isCodeValid = await this.authService.validateOtpCode(
      user,
      validateCodeDto.code,
    );
    if (!isCodeValid) {
      throw new BadRequestException('Code is invalid');
    }

    // TODO: Generate and send JWT Token with Passport.
  }
}
