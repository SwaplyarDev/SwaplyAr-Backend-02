import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OtpCode } from '@auth/entities/otp-code.entity';
import { User } from '@users/entities/user.entity';
import { MailerService } from '@mailer/mailer.service';
import { generate } from 'otp-generator';

@Injectable()
export class OtpService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,

    @InjectRepository(OtpCode)
    private readonly otpRepo: Repository<OtpCode>,

    private readonly mailer: MailerService,
  ) {}

  async sendOtpToEmail(email: string): Promise<void> {
    // ahora buscás el usuario tú mismo:
    const user = await this.userRepo.findOne({
      where: { profile: { email } },
      relations: ['profile'],
    });
    if (!user) throw new BadRequestException('Email not associated');

    const otp = await this.createOtpFor(user);
    await this.mailer.sendAuthCodeMail(user.profile.email, otp.code);
  }

  async validateOtpAndGetUser(email: string, code: string): Promise<User> {
    const user = await this.userRepo.findOne({
      where: { profile: { email } },
      relations: ['profile'],
    });
    if (!user) throw new BadRequestException('Email not associated');

    const otp = await this.otpRepo.findOne({
      where: { code: code.trim(), user: { id: user.id } },
      relations: ['user'],
    });
    if (!otp || otp.expiryDate < new Date() || otp.isUsed) {
      throw new BadRequestException('Invalid or expired code');
    }

    otp.isUsed = true;
    await this.otpRepo.save(otp);
    return user;
  }

  private async createOtpFor(user: User): Promise<OtpCode> {
    const code = generate(6, {
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      specialChars: false,
    }).trim();

    const otp = this.otpRepo.create({
      user,
      code,
      expiryDate: new Date(Date.now() + 60 * 60 * 1000),
    });
    return this.otpRepo.save(otp);
  }

  async generateAndSendOtp(user: User): Promise<void> {
    const otp = await this.createOtpFor(user);
    await this.mailer.sendAuthCodeMail(user.profile.email, otp.code);
  }
}
