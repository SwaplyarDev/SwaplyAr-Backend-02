import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { MailerModule } from '@mailer/mailer.module';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from 'src/common/jwt.strategy';
import { User } from '@users/entities/user.entity';
import { OtpCode } from './entities/otp-code.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, OtpCode]),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'access_secret',
      signOptions: { expiresIn: '15m' },
    }),
    MailerModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
