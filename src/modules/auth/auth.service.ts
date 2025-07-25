// src/modules/auth/auth.service.ts
import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '@users/entities/user.entity';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>, // ← inyecta User repo
    private readonly jwtService: JwtService,
  ) {}

  private buildPayload(user: User) {
    return {
      sub: user.id,
      email: user.profile.email,
      role: user.role,
      fullName: `${user.profile.firstName} ${user.profile.lastName}`,
      terms: user.termsAccepted,
      isActive: user.isActive,
      createdAt: user.createdAt,
      profile: user.profile,
      category: user.profile.category,
      isValidated: user.isValidated,
    };
  }

  async generateTokens(user: User) {
    const payload = this.buildPayload(user);
    const accessToken = this.jwtService.sign(payload, { expiresIn: '1h' });
    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: '7d',
    });

    user.refreshToken = refreshToken;
    await this.userRepo.save(user);

    return { access_token: accessToken, refresh_token: refreshToken };
  }

  async refreshAccessToken(refreshToken: string) {
    const user = await this.userRepo.findOne({ where: { refreshToken },
    relations: ['profile'], });
    if (!user || !user.refreshToken) {
      throw new BadRequestException('Invalid refresh token');
    }
    this.jwtService.verify(user.refreshToken, {
      secret: process.env.JWT_REFRESH_SECRET,
    });
    const payload = this.buildPayload(user);
    const accessToken = this.jwtService.sign(payload, { expiresIn: '1h' });
    const newRefreshToken = this.jwtService.sign(payload, {
    secret: process.env.JWT_REFRESH_SECRET,
    expiresIn: '7d',
  });
  user.refreshToken = newRefreshToken;
  await this.userRepo.save(user);
  return { access_token: accessToken, refresh_token: newRefreshToken };

    //return { access_token: accessToken };
  }
}
