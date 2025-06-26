import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailerModule } from '@mailer/mailer.module';
import { OtpService } from './otp.service';
import { OtpController } from './otp.controller';
import { OtpCode } from '@auth/entities/otp-code.entity';
import { User } from '@users/entities/user.entity';
import {AuthModule} from "@auth/auth.module";

@Module({
    imports: [
        TypeOrmModule.forFeature([User, OtpCode]),
        MailerModule,
        AuthModule,
    ],
    providers: [OtpService],
    controllers: [OtpController],
    exports: [OtpService],
})
export class OtpModule {}
