// src/modules/auth/auth.service.ts
import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '@users/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';

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

 async refreshAccessToken(userId: string, refreshToken: string) {
  try {
    const user = await this.userRepo.findOneBy({ id: userId });

    if (!user || user.refreshToken !== refreshToken) {
      throw new UnauthorizedException('Refresh token inválido');
    }

    // Verificar que el refreshToken sea válido (JWT)
    const payload = await this.jwtService.verifyAsync(refreshToken, {
      secret: process.env.JWT_REFRESH_SECRET,
    });

    const accessToken = this.jwtService.sign(
      { sub: user.id,  },
      { expiresIn: '1h' },
    );

    return {
      access_token: accessToken,
      // Opcional: devolver refresh_token si querés rotarlo
    };
  } catch (err) {
    throw new UnauthorizedException('Refresh token inválido o expirado');
  }
}}
