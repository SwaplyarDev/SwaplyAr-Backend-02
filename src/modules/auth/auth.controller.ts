import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Get,
  ValidationPipe,
} from '@nestjs/common';
import { SendCodeDto } from '@auth/dto/send-code.dto';
import { UsersService } from '@users/users.service';
import { MailerService } from '@mailer/mailer.service';
import { AuthService } from '@auth/auth.service';
import { ValidateCodeDto } from '@auth/dto/validate-code.dto';
import { JwtService } from '@nestjs/jwt';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller(['login'])
export class AuthController {
  constructor(
    private usersService: UsersService,
    private mailService: MailerService,
    private authService: AuthService,
    private jwtService: JwtService,
  ) {}


  //documentado
  @ApiOperation({ summary: 'Enviar código OTP al email del usuario' })
  @ApiResponse({ status: 200, description: 'Código enviado correctamente', schema: {
    example: {
      success: true,
      message: 'Código enviado correctamente'
    }
  }})
  @ApiResponse({ status: 400, description: 'Email address not associated with any account' })
  @ApiBody({
    description: 'Email del usuario',
    type: SendCodeDto,
    examples: {
      ejemplo1: {
        summary: 'Ejemplo de request',
        value: {
          email: 'nahuel@gmail.com'
        }
      }
    }
  })
  @Post('/email/send')
  @HttpCode(HttpStatus.OK)
  async sendOtpCode(@Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true })) sendCodeDto: SendCodeDto) {
    const user = await this.usersService.findByEmail(sendCodeDto.email);
    if (!user) {
      throw new BadRequestException(
        'Email address not associated with any account',
      );
    }

    const otpCode = await this.authService.createOtpCode(user);
    return this.mailService.sendAuthCodeMail(user.profile.email, otpCode.code);
  }


  //documentado
  @ApiOperation({ summary: 'Validar código OTP recibido por email' })
  @ApiResponse({ status: 200, description: 'Tokens generados correctamente', schema: {
    example: {
      access_token: 'jwt-access-token',
      refresh_token: 'jwt-refresh-token'
    }
  }})
  @ApiResponse({ status: 400, description: 'Email address not associated with any account o código inválido' })
  @ApiBody({
    description: 'Email y código OTP',
    type: ValidateCodeDto,
    examples: {
      ejemplo1: {
        summary: 'Ejemplo de request',
        value: {
          email: 'nahuel@gmail.com',
          code: '123456'
        }
      }
    }
  })
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

   
    const payload = { 
      sub: user.id, 
      email: validateCodeDto.email,
      role: user.role,
      fullName: user.profile.firstName + ' ' + user.profile.lastName,
      terms: user.termsAccepted,
      isActive: user.isActive,
      createdAt: user.createdAt,
      profile: user.profile,
      category: user.profile.category,
      isValidated: user.isValidated,
      };
    const accessToken = this.jwtService.sign(payload, {
      expiresIn: '1h',
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


  //documentado
  @ApiOperation({ summary: 'Renovar access token usando refresh token' })
  @ApiResponse({ status: 200, description: 'Nuevo access token generado', schema: {
    example: {
      access_token: 'jwt-access-token'
    }
  }})
  @ApiResponse({ status: 400, description: 'Invalid user or refresh token not found' })
  @ApiBody({
    description: 'ID del usuario',
    schema: {
      example: {
        userId: 'uuid-del-usuario'
      }
    }
  })
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
    const newPayload = { 
      sub: user.id, 
      email: email,
      role: user.role,
      fullName: user.profile.firstName + ' ' + user.profile.lastName,
      terms: user.termsAccepted,
      isActive: user.isActive,
      createdAt: user.createdAt,
      profile: user.profile,
      category: user.profile.category,
      isValidated: user.isValidated,
      };
    const accessToken = this.jwtService.sign(newPayload, {
      expiresIn: '1h',
    });

    return { access_token: accessToken };
  }

  

  //documentado
  @ApiOperation({ summary: 'Información del endpoint de verificación de email' })
  @ApiResponse({ status: 200, description: 'Mensaje informativo', schema: {
    example: {
      message: 'Endpoint de verificación de email disponible.'
    }
  }})
  @Get('/email-verification')
  @HttpCode(HttpStatus.OK)
  async emailVerificationInfo() {
    return { message: 'Endpoint de verificación de email disponible.' };
  }
}


