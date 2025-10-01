

import { Injectable } from '@nestjs/common';
import { ConversionRequestDto } from '../dto/conversion-request.dto';
import { ConversionResponseDto } from '../dto/conversion-response.dto';

@Injectable()
export class ConversionsService {
  async convert(dto: ConversionRequestDto): Promise<ConversionResponseDto> {
    const { from, to, amount } = dto;
    const rate = 1.1; // 🔹 mock fijo por ahora
    const convertedAmount = amount * rate;

    return {
      from,
      to,
      amount,
      convertedAmount,
      rateUsed: rate,
      message: 'Conversión realizada correctamente',
    };
  }
}

