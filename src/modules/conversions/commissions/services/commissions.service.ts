import { Injectable, BadRequestException } from '@nestjs/common';
import { COMMISSION_RULES } from '../constants/commisions-rules';
import { CommissionResponseDto } from '../dto/commissions-response.dto';

@Injectable()
export class CommissionsService {
  calculateCommission(
    amount: number,
    fromPlatform: string,
    toPlatform: string,
  ): CommissionResponseDto {
    console.log('Checking rule for:', fromPlatform, '->', toPlatform);
    const rule = COMMISSION_RULES.find((r) => r.from === fromPlatform && r.to === toPlatform);

    if (!rule) {
      throw new BadRequestException(
        `No se encontró una regla de comisión para ${fromPlatform} → ${toPlatform}.`,
      );
    }

    const commissionRate = rule.rate;
    const commissionValue = +(amount * commissionRate).toFixed(2);
    const finalAmount = +(amount - commissionValue).toFixed(2);

    return {
      fromPlatform,
      toPlatform,
      amount,
      commissionRate,
      commissionValue,
      finalAmount,
      message: 'Comisión calculada correctamente.',
    };
  }

  calculateCommissionWithCurrencyCheck(
    amount: number,
    fromPlatform: string,
    toPlatform: string,
    fromCurrency: string,
    toCurrency: string,
  ): { valid: boolean; data?: CommissionResponseDto } {
    const extractCurrency = (platform: string): string | null => {
      const match = platform.match(/\b(USD|EUR|ARS|BRL)\b/);
      return match ? match[0] : null;
    };

    const fromCurrencyInPlatform = extractCurrency(fromPlatform);
    const toCurrencyInPlatform = extractCurrency(toPlatform);

    if (fromCurrencyInPlatform !== fromCurrency || toCurrencyInPlatform !== toCurrency) {
      return { valid: false };
    }

    const rule = COMMISSION_RULES.find((r) => r.from === fromPlatform && r.to === toPlatform);

    if (!rule) {
      return { valid: false };
    }

    const commissionRate = rule.rate;
    const commissionValue = +(amount * commissionRate).toFixed(2);
    const finalAmount = +(amount - commissionValue).toFixed(2);

    const data: CommissionResponseDto = {
      fromPlatform,
      toPlatform,
      amount,
      commissionRate,
      commissionValue,
      finalAmount,
      message: 'Comisión calculada correctamente.',
    };

    return { valid: true, data };
  }
}
