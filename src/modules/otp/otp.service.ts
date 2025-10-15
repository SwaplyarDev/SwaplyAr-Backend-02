import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
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
  private readonly logger = new Logger(OtpService.name);

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
    this.logger.log(`Iniciando envío de OTP para email: ${email}`);
    const user = await this.userRepo
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.profile', 'profile')
      .where('profile.email = :email', { email })
      .getOne();

    if (!user) {
      this.logger.log(`Usuario no encontrado para email: ${email}`);
      throw new BadRequestException('El correo no está asociado a ningún usuario.');
    }

    this.logger.log(`Usuario encontrado: ${user.id}, enviando OTP`);
    const otp = await this.createOtpFor(user);

    try {
      this.logger.log(`Enviando email de OTP a: ${user.profile.email}`);
      await this.mailer.sendAuthCodeMail(
        user.profile.email,
        {
          NAME: user.profile.firstName || user.profile.email,
          VERIFICATION_CODE: otp.code,
          BASE_URL: process.env.BASE_URL || 'https://swaplyar.com',
          EXPIRATION_MINUTES: 15,
        },
        'login',
      );
      this.logger.log(`Email de OTP enviado exitosamente a: ${user.profile.email}`);
    } catch (error) {
      this.logger.error(
        `Error al enviar email de OTP: ${error instanceof Error ? error.message : error}`,
      );
      let errorMessage = 'Error desconocido';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      throw new InternalServerErrorException('Error al enviar el correo: ' + errorMessage);
    }
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

    try {
      this.logger.log(`Enviando email de OTP para transacción a: ${email}`);
      await this.mailer.sendAuthCodeMail(email, {
        NAME: email,
        VERIFICATION_CODE: otp.code,
        BASE_URL: process.env.BASE_URL || 'https://swaplyar.com',
        EXPIRATION_MINUTES: 5,
      });
      this.logger.log(`Email de OTP para transacción enviado exitosamente a: ${email}`);
    } catch (error) {
      this.logger.error(
        `Error al enviar email de OTP para transacción: ${error instanceof Error ? error.message : error}`,
      );
      let errorMessage = 'Error desconocido al enviar el correo';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      throw new InternalServerErrorException('Error al enviar el correo: ' + errorMessage);
    }
  }

  async validateOtpAndGetUser(email: string, code: string): Promise<User> {
    this.logger.log(`Iniciando validación de OTP para email: ${email}, código: ${code}`);
    const user = await this.userRepo
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.profile', 'profile')
      .where('profile.email = :email', { email })
      .getOne();
    if (!user) {
      this.logger.log(`Usuario no encontrado para email: ${email}`);
      throw new BadRequestException('Email not associated');
    }

    this.logger.log(`Usuario encontrado: ${user.id}, buscando OTP`);
    const otp = await this.otpRepo.findOne({
      where: { code: code.trim(), user: { id: user.id } },
      relations: ['user'],
    });
    if (!otp || otp.expiryDate < new Date() || otp.isUsed) {
      this.logger.log(`OTP inválido o expirado para usuario: ${user.id}`);
      throw new BadRequestException('Invalid or expired code');
    }

    this.logger.log(`OTP válido, marcando como usado`);
    otp.isUsed = true;
    await this.otpRepo.save(otp);
    this.logger.log(`Validación exitosa para usuario: ${user.id}`);
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
    try {
      this.logger.log(`Enviando email de OTP para registro a: ${user.profile.email}`);
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
      this.logger.log(`Email de OTP para registro enviado exitosamente a: ${user.profile.email}`);
    } catch (error) {
      this.logger.error(
        `Error al enviar email de OTP para registro: ${error instanceof Error ? error.message : error}`,
      );
      let errorMessage = 'Error desconocido al enviar el correo';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      throw new InternalServerErrorException('Error al enviar el correo: ' + errorMessage);
    }
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
    this.logger.debug(`Verificando token OTP`);
    try {
      this.logger.debug(`Decodificando token`);
      const payload = jwt.verify(token, this.secret) as {
        transactionId: string;
        iat?: number;
        exp?: number;
      };

      this.logger.debug('Payload del token verificado:', payload);

      return payload;
    } catch {
      throw new UnauthorizedException('OTP inválido o expirado');
    }
  }
}
