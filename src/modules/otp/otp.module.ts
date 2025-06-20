// src/modules/otp/otp.module.ts
import { Module }        from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OtpCode }       from '@auth/entities/otp-code.entity';
import { User }          from '@users/entities/user.entity';
import { OtpService }    from './otp.service';
import { MailerModule }  from '@mailer/mailer.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([User, OtpCode]),  // ¡ENTIDADES, no módulos!
        MailerModule,                               // módulo de mailing
    ],
    providers: [OtpService],
    exports:    [OtpService],
})
export class OtpModule {}
