import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DynamicCommission } from '../entities/dynamicCommissions.entity';
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
      fromPlatformId: entity.fromPlatformId,
      toPlatformId: entity.toPlatformId,
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
    fromPlatformId: string;
    toPlatformId: string;
    commissionRate: number;
  }): Promise<DynamicCommissionResponseDto> {
    const { fromPlatformId, toPlatformId, commissionRate } = data;

    // Validar que sean diferentes
    this.ensureDifferentPlatforms(fromPlatformId, toPlatformId);

    // Verificar si ya existe la comisión
    const exists = await this.commissionRepo.findOne({
      where: { fromPlatformId, toPlatformId },
    });

    if (exists) {
      throw new BadRequestException({
        statusCode: 400,
        message: [
          `Ya existe una comisión para ${fromPlatformId} → ${toPlatformId}. Usa PATCH para actualizar.`,
        ],
        error: 'Bad Request',
      });
    }

    // Crear y guardar la nueva comisión
    const commission = this.commissionRepo.create({
      fromPlatformId,
      toPlatformId,
      commissionRate,
    });

    const saved = await this.commissionRepo.save(commission);

    return this.toResponseDto(saved);
  }

  async update(data: {
    fromPlatformId: string;
    toPlatformId: string;
    commissionRate: number;
  }): Promise<DynamicCommissionResponseDto> {
    const { fromPlatformId, toPlatformId, commissionRate } = data;

    this.ensureDifferentPlatforms(fromPlatformId, toPlatformId);

    const existing = await this.commissionRepo.findOne({
      where: { fromPlatformId, toPlatformId },
    });

    if (!existing) {
      throw new NotFoundException({
        statusCode: 404,
        message: [
          `No se encontró una comisión para ${fromPlatformId} → ${toPlatformId}. Usa POST para crear.`,
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
    fromPlatformId?: string,
    toPlatformId?: string,
  ): Promise<DynamicCommissionResponseDto[]> {
    const query = this.commissionRepo.createQueryBuilder('commission');

    if (fromPlatformId) {
      query.andWhere('commission.from_platform_id = :fromPlatformId', { fromPlatformId });
    }

    if (toPlatformId) {
      query.andWhere('commission.to_platform_id = :toPlatformId', { toPlatformId });
    }

    const results = await query.getMany();

    if (!results.length) {
      throw new NotFoundException({
        statusCode: 404,
        message: [
          `No se encontró una comisión para ${fromPlatformId ?? '??'} → ${toPlatformId ?? '??'}. Usa POST para crear.`,
        ],
        error: 'Not Found',
      });
    }

    return results.map((c) => this.toResponseDto(c));
  }

  async findOneByPair(
    fromPlatformId: string,
    toPlatformId: string,
  ): Promise<DynamicCommissionResponseDto | null> {
    const found = await this.commissionRepo.findOne({
      where: { fromPlatformId, toPlatformId },
    });

    return found ? this.toResponseDto(found) : null;
  }
}
