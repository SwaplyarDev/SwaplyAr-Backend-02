import { Module } from '@nestjs/common';
import { UsersModule } from '@users/users.module';
import { AuthController } from '@auth/auth.controller';
import { MailerModule } from '@mailer/mailer.module';
import { AuthService } from '@auth/auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OtpCode } from '@auth/entities/otp-code.entity';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    UsersModule, 
    MailerModule, 
    TypeOrmModule.forFeature([OtpCode]),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'access_secret',
      signOptions: { expiresIn: '15m' },
    }),
  ],
  providers: [JwtStrategy, AuthService],
  controllers: [AuthController],
  exports: [
    JwtModule,
  ],
})
export class AuthModule {}
