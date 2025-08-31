import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OtpCode } from '../auth/entities/otp-code.entity';
import { User } from '@users/entities/user.entity';
import { MailerService } from '@mailer/mailer.service';
import { generate } from 'otp-generator';
import * as jwt from 'jsonwebtoken';

import { Transaction } from '@transactions/entities/transaction.entity';

@Injectable()
export class OtpService {
  private readonly secret: string;
  private readonly ttlSeconds: number;

  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepo: Repository<Transaction>,

    @InjectRepository(User)
    private readonly userRepo: Repository<User>,

    @InjectRepository(OtpCode)
    private readonly otpRepo: Repository<OtpCode>,

    private readonly mailer: MailerService,
  ) {
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET environment variable is not defined');
    }
    this.secret = process.env.JWT_SECRET;
    this.ttlSeconds = 16000;
  }

  async sendOtpToEmail(email: string): Promise<void> {
    // ahora buscás el usuario tú mismo:
    const user = await this.userRepo.findOne({
      where: { profile: { email } },
      relations: ['profile'],
    });
    if (!user) throw new BadRequestException('Email not associated');

    const otp = await this.createOtpFor(user);
    //await this.mailer.sendAuthCodeMail(user.profile.email, otp.code);
    await this.mailer.sendAuthCodeMail(
      user.profile.email,
      {
        NAME: user.profile.firstName || user.profile.email,
        VERIFICATION_CODE: otp.code,
        BASE_URL: process.env.BASE_URL || 'https://swaplyar.com',
        EXPIRATION_MINUTES: 15, // o el valor que uses
      },
      'login',
    );
  }

  async sendOtpForTransaction(transactionId: string) {
    // 1. Buscar la transacción con la relación senderAccount
    const transaction = await this.transactionRepo.findOne({
      where: { id: transactionId },
      relations: ['senderAccount'], // <- aquí incluimos senderAccount
    });

    if (!transaction) {
      throw new BadRequestException('Transacción no encontrada');
    }
    if (!transaction.senderAccount?.createdBy) {
      throw new BadRequestException('Transacción sin email');
    }

    const email = transaction.senderAccount.createdBy;

    const otp = await this.createOtpForTransaction(transactionId, email);

    await this.mailer.sendAuthCodeMail(email, {
      NAME: email,
      VERIFICATION_CODE: otp.code,
      BASE_URL: process.env.BASE_URL || 'https://swaplyar.com',
      EXPIRATION_MINUTES: 5,
    });
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

  async validateOtpForTransaction(email: string, code: string): Promise<boolean> {
    // Buscar OTP por email y código
    const otp = await this.otpRepo.findOne({
      where: { email, code, isUsed: false },
    });

    // OTP no encontrado o ya usado
    if (!otp) {
      return false;
    }
    // OTP expirado
    if (otp.expiryDate < new Date()) {
      return false;
    }
    // set OTP como usado para evitar reutilización
    otp.isUsed = true;
    await this.otpRepo.save(otp);

    return true;
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

  private async createOtpForTransaction(transactionId: string, email: string): Promise<OtpCode> {
    const code = generate(6, {
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      specialChars: false,
    }).trim();
    const otp = this.otpRepo.create({
      transactionId,
      email,
      code,
      expiryDate: new Date(Date.now() + 10 * 60 * 1000), // 10 min
    });
    return this.otpRepo.save(otp);
  }

  async generateAndSendOtp(user: User): Promise<void> {
    const otp = await this.createOtpFor(user);
    //await this.mailer.sendAuthCodeMail(user.profile.email, otp.code);
    await this.mailer.sendAuthCodeMail(
      user.profile.email,
      {
        ID: user.profile.id,
        NAME: user.profile.firstName || user.profile.email,
        VERIFICATION_CODE: otp.code,
        BASE_URL: process.env.BASE_URL || 'http://localhost:3001',
        EXPIRATION_MINUTES: 10,
      },
      'register',
    );
  }

  generateOtpToken(transactionId: string): string {
    return jwt.sign({ transactionId }, this.secret, {
      expiresIn: `${this.ttlSeconds}s`,
    });
  }

  verifyOtpToken(token: string): {
    transactionId: string;
    iat?: number;
    exp?: number;
  } {
    console.log(this.secret);
    try {
      console.log(this.secret);
      const payload = jwt.verify(token, this.secret) as {
        transactionId: string;
        iat?: number;
        exp?: number;
      };

      console.log('Payload del token verificado:', payload);

      return payload;
    } catch {
      throw new UnauthorizedException('OTP inválido o expirado');
    }
  }
}
