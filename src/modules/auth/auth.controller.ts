import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Get,
} from '@nestjs/common';
import { SendCodeDto } from '@auth/dto/send-code.dto';
import { UsersService } from '@users/users.service';
import { MailerService } from '@mailer/mailer.service';
import { AuthService } from '@auth/auth.service';
import { ValidateCodeDto } from '@auth/dto/validate-code.dto';
import { JwtService } from '@nestjs/jwt';

@Controller(['login'])
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

    // Marcar el código OTP como usado
    await this.authService.markOtpCodeAsUsed(user, validateCodeDto.code);

    // Construir el payload extendido
    const payload: any = {
      id: user.id,
      fullName: user.profile ? `${user.profile.firstName} ${user.profile.lastName}` : undefined,
      terms: user.termsAccepted,
      isActive: user.isActive,
      createdAt: user.createdAt,
      isBanned: Array.isArray(user.bans) ? user.bans.some(ban => ban.isActive) : false,
      userVerification: user.verifications ? user.verifications.map(v => ({
        id: v.id,
        status: v.verificationStatus,
        verifiedAt: v.verifiedAt
      })) : [],
      profile: user.profile ? {
        firstName: user.profile.firstName,
        lastName: user.profile.lastName,
        email: user.profile.email,
        identification: user.profile.identification,
        phone: user.profile.phone,
        birthday: user.profile.birthday,
        age: user.profile.age,
        gender: user.profile.gender,
        lastActivity: user.profile.lastActivity,
        profilePictureUrl: user.profile.profilePictureUrl
      } : undefined,
      social: user.profile && user.profile.socials ? {
        whatsappNumber: user.profile.socials.whatsappNumber,
        facebook: user.profile.socials.facebook,
        instagram: user.profile.socials.instagram,
        tiktok: user.profile.socials.tiktok,
        twitterX: user.profile.socials.twitterX,
        snapchat: user.profile.socials.snapchat,
        linkedin: user.profile.socials.linkedin,
        youtube: user.profile.socials.youtube,
        pinterest: user.profile.socials.pinterest
      } : undefined,
      category: user.profile && user.profile.category ? {
        id: user.profile.category.id,
        category: user.profile.category.category,
        requirements: user.profile.category.requirements
      } : undefined,
      ban: Array.isArray(user.bans) && user.bans.length > 0 ? user.bans.map(ban => ({
        id: ban.id,
        reason: ban.reason,
        startDate: ban.startDate,
        endDate: ban.endDate,
        isPermanent: ban.isPermanent,
        isActive: ban.isActive
      })) : [],
      email: validateCodeDto.email,
      role: user.role
    };

    const accessToken = this.jwtService.sign(payload, {
      // expiresIn: '15m', // puedes quitar esto si quieres que no expire
    });

    // Generar refresh token
    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      // expiresIn: '7d',
    });

    // Guardar el refresh token en la base de datos 
    user.refreshToken = refreshToken;
    await this.usersService.save(user);

    return { access_token: accessToken, refresh_token: refreshToken };
  }

  @Post('/refresh')
  @HttpCode(HttpStatus.OK)
  async refreshToken(@Body('userId') userId: string) {
    const user = await this.usersService.findById(userId);
    if (!user || !user.refreshToken) {
      throw new BadRequestException('Invalid user or refresh token not found');
    }

    let payload: any;
    try {
      payload = this.jwtService.verify(user.refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET,
      });
    } catch {
      throw new BadRequestException('Invalid or expired refresh token');
    }

    // Obtener el email desde el payload del refresh token
    const email = payload.email;
    // Generar nuevo access token
    const newPayload = { sub: user.id, email: email, role: user.role };
    const accessToken = this.jwtService.sign(newPayload, {
      expiresIn: '15m',
    });

    return { access_token: accessToken };
  }

  @Get('/email-verification')
  @HttpCode(HttpStatus.OK)
  async emailVerificationInfo() {
    return { message: 'Endpoint de verificación de email disponible.' };
  }
}


