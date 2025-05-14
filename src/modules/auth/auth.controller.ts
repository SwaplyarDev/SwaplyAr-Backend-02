import { Body, Controller, NotFoundException, Post } from '@nestjs/common';
import { SendCodeDto } from '@auth/dto/send-code.dto';
import { UsersService } from '@users/users.service';
import { MailerService } from '@mailer/mailer.service';

@Controller('login')
export class AuthController {
  constructor(
    private usersService: UsersService,
    private mailService: MailerService,
  ) {}

  @Post('/email/send')
  async sendVerificationCode(@Body() sendCodeDto: SendCodeDto) {
    const user = await this.usersService.findByEmail(sendCodeDto.email);
    if (!user) {
      throw new NotFoundException('Email not registered');
    }
    // TODO: Generar código
    return this.mailService.sendMail(user.profile.email, '12345');
  }
}
