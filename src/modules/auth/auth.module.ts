import { Module } from '@nestjs/common';
import { UsersModule } from '@users/users.module';
import { AuthController } from '@auth/auth.controller';
import { MailerModule } from '@mailer/mailer.module';

@Module({
  imports: [UsersModule, MailerModule],
  controllers: [AuthController],
})
export class AuthModule {}
