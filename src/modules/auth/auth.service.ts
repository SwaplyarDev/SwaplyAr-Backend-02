import { Injectable } from '@nestjs/common';
import { User } from '@users/entities/user.entity';
import { OtpCode } from '@auth/entities/otp-code.entity';
import { generate } from 'otp-generator';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(OtpCode) private otpCodeRepository: Repository<OtpCode>,
  ) {}

  createOtpCode(user: User): Promise<OtpCode> {
    const code = generate(6, {
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      specialChars: false,
    });

    const otpCode = new OtpCode();
    otpCode.code = code;
    otpCode.user = user;

    const oneHourInMillis = 60 * 60 * 1000;
    otpCode.expiryDate = new Date(Date.now() + oneHourInMillis);

    return this.otpCodeRepository.save(otpCode);
  }

  async validateOtpCode(user: User, code: string): Promise<boolean> {
    const otpCode = await this.otpCodeRepository.findOne({
      where: { code, user },
    });

    if (!otpCode) {
      return false;
    }

    const isExpired = otpCode.expiryDate.getTime() > Date.now();
    return !(isExpired || otpCode.isUsed);
  }
}
