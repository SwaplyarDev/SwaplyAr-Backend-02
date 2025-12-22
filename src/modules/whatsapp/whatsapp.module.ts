import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { WhatsAppService } from './whatsapp.service';
import { WhatsAppController } from './whatsapp.controller';
import { OtpCode } from '@auth/entities/otp-code.entity';
import { User } from '@users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, OtpCode]), HttpModule],
  providers: [WhatsAppService],
  controllers: [WhatsAppController],
  exports: [WhatsAppService],
})
export class WhatsAppModule {}
