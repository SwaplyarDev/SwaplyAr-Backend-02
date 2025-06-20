import { Module }            from '@nestjs/common';
import { TypeOrmModule }     from '@nestjs/typeorm';
import { JwtModule }         from '@nestjs/jwt';
import { MailerModule }      from '@mailer/mailer.module';
import { OtpModule }         from '../otp/otp.module';
import { AuthController }    from './auth.controller';
import { AuthService }       from './auth.service';
import { JwtStrategy }       from 'src/common/jwt.strategy';
import { OtpCode }           from './entities/otp-code.entity';
import { User }              from '@users/entities/user.entity';

@Module({
  imports: [
    // repositorios que AuthService necesita:
    TypeOrmModule.forFeature([User, OtpCode]),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'access_secret',
      signOptions: { expiresIn: '15m' },
    }),
    MailerModule,
    OtpModule,

  ],
  controllers: [AuthController],
  providers:  [AuthService, JwtStrategy],
  exports:    [AuthService],
})
export class AuthModule {}