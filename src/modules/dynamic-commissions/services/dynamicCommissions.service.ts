import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DynamicCommission } from '../entities/dynamicCommissions.entity';
import { PlatformName } from '../../../enum/commissions.enum';
import { DynamicCommissionResponseDto } from '../dto/dynamic-commission-response.dto';

@Injectable()
export class DynamicCommissionsService {
  constructor(
    @InjectRepository(DynamicCommission)
    private readonly commissionRepo: Repository<DynamicCommission>,
  ) {}

  private toResponseDto(entity: DynamicCommission): DynamicCommissionResponseDto {
    return {
      id: entity.id,
      fromPlatform: entity.fromPlatform as PlatformName,
      toPlatform: entity.toPlatform as PlatformName,
      commissionRate: entity.commissionRate,
      createdAt: entity.createdAt.toISOString(),
      updatedAt: entity.updatedAt.toISOString(),
    };
  }

  private extractCurrency(platform: string): string | null {
    return platform.match(/\b(USD|EUR|ARS|BRL|USDT)\b/i)?.[0]?.toUpperCase() ?? null;
  }

  private normalizePlatformName(platform: string): string {
    return platform
      .replace(/\b(USD|EUR|ARS|BRL|USDT)\b/gi, '')
      .trim()
      .toLowerCase();
  }
  private ensureDifferentPlatforms(from: string, to: string): void {
    const sameBase = this.normalizePlatformName(from) === this.normalizePlatformName(to);
    const sameCurrency = this.extractCurrency(from) === this.extractCurrency(to);

    if (sameBase && sameCurrency) {
      throw new BadRequestException({
        statusCode: 400,
        message: ['No se puede crear o actualizar una comisión para la misma plataforma y moneda.'],
        error: 'Bad Request',
      });
    }
  }

  async create(data: {
    fromPlatform: PlatformName;
    toPlatform: PlatformName;
    commissionRate: number;
  }): Promise<DynamicCommissionResponseDto> {
    const { fromPlatform, toPlatform } = data;

    this.ensureDifferentPlatforms(fromPlatform, toPlatform);

    const exists = await this.commissionRepo.findOne({ where: { fromPlatform, toPlatform } });
    if (exists) {
      throw new BadRequestException({
        statusCode: 400,
        message: [
          `Ya existe una comisión para ${fromPlatform} → ${toPlatform}. Usa PATCH para actualizar.`,
        ],
        error: 'Bad Request',
      });
    }

    const saved = await this.commissionRepo.save(this.commissionRepo.create(data));
    return this.toResponseDto(saved);
  }

  async update(data: {
    fromPlatform: PlatformName;
    toPlatform: PlatformName;
    commissionRate: number;
  }): Promise<DynamicCommissionResponseDto> {
    const { fromPlatform, toPlatform, commissionRate } = data;

    this.ensureDifferentPlatforms(fromPlatform, toPlatform);

    const existing = await this.commissionRepo.findOne({ where: { fromPlatform, toPlatform } });
    if (!existing) {
      throw new NotFoundException({
        statusCode: 404,
        message: [
          `No se encontró una comisión para ${fromPlatform} → ${toPlatform}. Usa POST para crear.`,
        ],
        error: 'Not Found',
      });
    }

    existing.commissionRate = commissionRate;
    existing.updatedAt = new Date();

    const saved = await this.commissionRepo.save(existing);
    return this.toResponseDto(saved);
  }

  async find(
    fromPlatform?: PlatformName,
    toPlatform?: PlatformName,
  ): Promise<DynamicCommissionResponseDto[]> {
    const query = this.commissionRepo.createQueryBuilder('commission');

    if (fromPlatform) query.andWhere('commission.fromPlatform = :fromPlatform', { fromPlatform });
    if (toPlatform) query.andWhere('commission.toPlatform = :toPlatform', { toPlatform });

    const results = await query.getMany();

    if (!results.length) {
      throw new NotFoundException({
        statusCode: 404,
        message: [
          `No se encontró una comisión para ${fromPlatform} → ${toPlatform}. Usa POST para crear.`,
        ],
        error: 'Not Found',
      });
    }

    return results.map((c) => this.toResponseDto(c));
  }

  async findOneByPair(
    fromPlatform: PlatformName,
    toPlatform: PlatformName,
  ): Promise<DynamicCommissionResponseDto | null> {
    const found = await this.commissionRepo.findOne({
      where: { fromPlatform, toPlatform },
    });

    return found ? this.toResponseDto(found) : null;
  }
}
