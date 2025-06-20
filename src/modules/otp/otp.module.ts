import { Module }            from '@nestjs/common';
import { TypeOrmModule }     from '@nestjs/typeorm';
import { OtpCode }           from '@auth/entities/otp-code.entity';
import { OtpService }        from './otp.service';
import { MailerModule }      from '@mailer/mailer.module';
import { UsersModule }       from '@users/users.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([OtpCode]),
        MailerModule,
        UsersModule,
    ],
    providers: [OtpService],
    exports:    [OtpService],
})
export class OtpModule {}
