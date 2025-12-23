import { Injectable, BadRequestException } from '@nestjs/common';
import { CommissionResponseDto } from '../dto/commissions-response.dto';
import { DynamicCommissionsService } from 'src/modules/dynamic-commissions/services/dynamicCommissions.service';

@Injectable()
export class CommissionsService {
  constructor(private readonly dynamicCommissionsService: DynamicCommissionsService) {}

  async calculateCommission(
    amount: number,
    fromPlatformId: string,
    toPlatformId: string,
  ): Promise<CommissionResponseDto> {
    const dynamicRule = await this.dynamicCommissionsService.findOneByPair(
      fromPlatformId,
      toPlatformId,
    );

    if (!dynamicRule) {
      throw new BadRequestException(
        `No se encontró una comisión para ${fromPlatformId} → ${toPlatformId}.`,
      );
    }

    const commissionRate = dynamicRule.commissionRate;
    const commissionValue = +(amount * commissionRate).toFixed(2);
    const finalAmount = +(amount - commissionValue).toFixed(2);

    return {
      fromPlatformId,
      toPlatformId,
      amount,
      commissionRate,
      commissionValue,
      finalAmount,
      message: 'Comisión calculada correctamente (fuente: dinámica).',
    };
  }

  async calculateCommissionWithCurrencyCheck(
    amount: number,
    fromPlatformId: string,
    toPlatformId: string,
    fromCurrency: string,
    toCurrency: string,
  ): Promise<{ valid: boolean; data?: CommissionResponseDto }> {
    const extractCurrency = (platform: string): string | null => {
      const match = platform.match(/\b(USD|EUR|ARS|BRL|USDT)\b/);
      return match ? match[0].toUpperCase() : null;
    };

    const fromCurrencyInPlatform = extractCurrency(fromPlatformId);
    const toCurrencyInPlatform = extractCurrency(toPlatformId);

    if (fromCurrencyInPlatform !== fromCurrency || toCurrencyInPlatform !== toCurrency) {
      return { valid: false };
    }

    const dynamicRule = await this.dynamicCommissionsService.findOneByPair(
      fromPlatformId,
      toPlatformId,
    );

    if (!dynamicRule) {
      return { valid: false };
    }

    const commissionRate = dynamicRule.commissionRate;
    const commissionValue = +(amount * commissionRate).toFixed(2);
    const finalAmount = +(amount - commissionValue).toFixed(2);

    const data: CommissionResponseDto = {
      fromPlatformId,
      toPlatformId,
      amount,
      commissionRate,
      commissionValue,
      finalAmount,
      message: 'Comisión calculada correctamente (fuente: dinámica).',
    };

    return { valid: true, data };
  }
}
