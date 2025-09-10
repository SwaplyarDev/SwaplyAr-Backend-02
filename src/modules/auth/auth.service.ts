import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MailerService } from 'src/modules/mailer/mailer.service';
import { User } from '@users/entities/user.entity';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly mailerService: MailerService, // ✅ Inyectado
  ) {}

  private buildPayload(user: User) {
    const profile = user.profile ?? {};

    return {
      sub: user.id,
      email: profile.email ?? '',
      role: user.role,
      fullName: `${profile.firstName ?? ''} ${profile.lastName ?? ''}`,
      terms: user.termsAccepted,
      isActive: user.isActive,
      createdAt: user.createdAt,
      profile: profile,
      category: profile.category ?? null,
      isValidated: user.isValidated,
      userValidated: user.userValidated,
    };
  }

  async generateTokens(user: User) {
    const payload = this.buildPayload(user);

    const accessToken = this.jwtService.sign(payload, { expiresIn: '1h' });
    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: '7d',
    });

    await this.userRepo.update(user.id, { refreshToken });

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  async refreshAccessToken(refreshToken: string) {
    const user = await this.userRepo.findOne({
      where: { refreshToken },
      relations: ['profile'],
    });

    if (!user || !user.refreshToken) {
      throw new BadRequestException('Invalid refresh token');
    }

    try {
      this.jwtService.verify(user.refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET,
      });
    } catch (error) {
      throw new UnauthorizedException(`Invalid or expired refresh token. - ${error}`);
    }

    const payload = this.buildPayload(user);
    const accessToken = this.jwtService.sign(payload, { expiresIn: '1h' });
    const newRefreshToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: '1d',
    });

    user.refreshToken = newRefreshToken;
    await this.userRepo.save(user);

    return { access_token: accessToken, refresh_token: newRefreshToken };
  }

  async sendLoginCodeEmail(user: User, code: string, location: string) {
    await this.mailerService.sendAuthCodeMail(user.profile.email, {
      NAME: user.profile.firstName || user.profile.email,
      VERIFICATION_CODE: code,
      BASE_URL: process.env.BASE_URL || 'https://swaplyar.com',
      LOCATION: location,
      EXPIRATION_MINUTES: 15,
    });
  }
}
