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
import { JwtService } from '@nestjs/jwt';

@Controller('login')
export class AuthController {
  constructor(
    private usersService: UsersService,
    private mailService: MailerService,
    private authService: AuthService,
    private jwtService: JwtService,
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

     // Generar access token
    const payload = { sub: user.id };
    const accessToken = this.jwtService.sign(payload, {
      expiresIn: '15m',
    });

    // Generar refresh token
    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: '7d',
    });

    // Guardar el refresh token en la base de datos 
    user.refreshToken = refreshToken;
    await this.usersService.save(user);

    return { access_token: accessToken, refresh_token: refreshToken };

  }
}
