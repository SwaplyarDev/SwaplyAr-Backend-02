import { Module } from '@nestjs/common';
import { MailerService } from '@mailer/mailer.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  providers: [MailerService],
  exports: [MailerService],
})
export class MailerModule {}
