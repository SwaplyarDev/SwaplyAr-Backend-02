

import { Injectable, BadRequestException } from '@nestjs/common';
import { CommissionResponseDto } from '../dto/commissions-response.dto';
import { DynamicCommissionsService } from 'src/modules/dynamic-commissions/services/dynamicCommissions.service';
import { PlatformName } from 'src/enum/commissions.enum';

@Injectable()
export class CommissionsService {
  constructor(
    private readonly dynamicCommissionsService: DynamicCommissionsService,
  ) {}

  async calculateCommission(
    amount: number,
    fromPlatform: string,
    toPlatform: string,
  ): Promise<CommissionResponseDto> {

    const from = fromPlatform as PlatformName;
    const to = toPlatform as PlatformName;
    
    const dynamicRule = await this.dynamicCommissionsService.findOneByPair(
      from,
      to,
    );

    if (!dynamicRule) {
      throw new BadRequestException(
        `No se encontró una comisión para ${fromPlatform} → ${toPlatform}.`,
      );
    }

    const commissionRate = dynamicRule.commissionRate;
    const commissionValue = +(amount * commissionRate).toFixed(2);
    const finalAmount = +(amount - commissionValue).toFixed(2);

    return {
      fromPlatform,
      toPlatform,
      amount,
      commissionRate,
      commissionValue,
      finalAmount,
      message: 'Comisión calculada correctamente (fuente: dinámica).',
    };
  }

  async calculateCommissionWithCurrencyCheck(
    amount: number,
    fromPlatform: string,
    toPlatform: string,
    fromCurrency: string,
    toCurrency: string,
  ): Promise<{ valid: boolean; data?: CommissionResponseDto }> {
    const extractCurrency = (platform: string): string | null => {
      const match = platform.match(/\b(USD|EUR|ARS|BRL|USDT)\b/);
      return match ? match[0].toUpperCase() : null;
    };

    const fromCurrencyInPlatform = extractCurrency(fromPlatform);
    const toCurrencyInPlatform = extractCurrency(toPlatform);

    if (fromCurrencyInPlatform !== fromCurrency || toCurrencyInPlatform !== toCurrency) {
      return { valid: false };
    }

    const from = fromPlatform as PlatformName;
    const to = toPlatform as PlatformName;

    const dynamicRule = await this.dynamicCommissionsService.findOneByPair(
      from,
      to,
    );

    if (!dynamicRule) {
      return { valid: false };
    }

    const commissionRate = dynamicRule.commissionRate;
    const commissionValue = +(amount * commissionRate).toFixed(2);
    const finalAmount = +(amount - commissionValue).toFixed(2);

    const data: CommissionResponseDto = {
      fromPlatform,
      toPlatform,
      amount,
      commissionRate,
      commissionValue,
      finalAmount,
      message: 'Comisión calculada correctamente (fuente: dinámica).',
    };

    return { valid: true, data };
  }
}
