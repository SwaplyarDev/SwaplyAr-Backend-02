import { BadRequestException, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { ConversionRequestDto } from '../dto/conversions-request.dto';
import { ConversionResponseDto } from '../dto/conversions-response.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ConversionsService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  private async fetchData() {
    const apiUrl = this.configService.get<string>('CONVERSION_API_URL');

    if (!apiUrl) {
      throw new Error('CONVERSION_API_URL is not defined in environment variables');
    }

    const { data } = await firstValueFrom(this.httpService.get(apiUrl));
    return data;
  }

  async convert(dto: ConversionRequestDto): Promise<ConversionResponseDto> {
    const { from, to, amount } = dto;

    if (from === to) {
      return {
        from,
        to,
        amount,
        convertedAmount: amount,
        rateUsed: 1,
        message: `Conversión no requerida: las divisas son iguales (${from}). Se aplica factor 1.`,
      };
    }

    const data = await this.fetchData();
    const pairKey = `${from} a ${to}`;

    const found = data.find(
      (entry) => entry['Actualizar Monedas Calculadora']['Par de MonedasR'] === pairKey,
    );

    if (!found) {
      throw new BadRequestException(`No se encontró tasa para el par ${pairKey}`);
    }

    const item = found['Actualizar Monedas Calculadora'];
    const rate = item['Valor'];
    const source = item['Fuente'];
    const lastUpdated = item['Última Actualización'];
    const convertedAmount = amount * rate;

    return {
      from,
      to,
      amount,
      convertedAmount,
      rateUsed: rate,
      message: `Conversión realizada correctamente (fuente: ${source}, última actualización: ${lastUpdated})`,
    };
  }

  async convertArs(dto: ConversionRequestDto): Promise<ConversionResponseDto> {
    const { from, to, amount } = dto;
    const data = await this.fetchData();

    const operationLabel = 'Compra';

    const key = from === 'USD' ? `USD Blue (Compra)` : `EUR Blue (Compra)`;

    const found = data.find(
      (entry) => entry['Actualizar Monedas Calculadora']['Par de MonedasR'] === key,
    );

    if (!found) {
      throw new BadRequestException(
        `No se encontró tasa para ${from} → ${to} en modalidad Blue (Compra}).`,
      );
    }

    const item = found['Actualizar Monedas Calculadora'];
    const rate = item['Valor'];
    const source = item['Fuente'];
    const lastUpdated = item['Última Actualización'];
    const convertedAmount = amount * rate;

    return {
      from,
      to,
      amount,
      convertedAmount,
      rateUsed: rate,
      message: `Conversión realizada correctamente usando ${item['Par de MonedasR']} (fuente: ${source}, última actualización: ${lastUpdated})`,
    };
  }

  async convertArsIndirect(dto: ConversionRequestDto): Promise<ConversionResponseDto> {
    const { from, to, amount } = dto;
    const data = await this.fetchData();

    if (from !== 'ARS') {
      throw new BadRequestException('Este método solo aplica para conversiones desde ARS.');
    }

    if (to === 'USD') {
      const usdBlueVenta = data.find(
        (entry) =>
          entry['Actualizar Monedas Calculadora']['Par de MonedasR'] === 'USD Blue (Venta)',
      );

      if (!usdBlueVenta) {
        throw new BadRequestException('No se encontró tasa USD Blue (Venta).');
      }

      const item = usdBlueVenta['Actualizar Monedas Calculadora'];
      const rateUsed = 1 / item['Valor'];
      const convertedAmount = amount * rateUsed;

      return {
        from,
        to,
        amount,
        convertedAmount,
        rateUsed,
        message: `Conversión indirecta ARS → USD realizada usando el inverso de USD Blue (Venta). Fuente: ${item['Fuente']}, última actualización: ${item['Última Actualización']}.`,
      };
    }

    if (to === 'EUR') {
      const eurBlueVenta = data.find(
        (entry) =>
          entry['Actualizar Monedas Calculadora']['Par de MonedasR'] === 'EUR Blue (Venta)',
      );

      if (!eurBlueVenta) {
        throw new BadRequestException('No se encontró tasa EUR → ARS.');
      }

      const item = eurBlueVenta['Actualizar Monedas Calculadora'];
      const rateUsed = 1 / item['Valor'];
      const convertedAmount = amount * rateUsed;

      return {
        from,
        to,
        amount,
        convertedAmount,
        rateUsed,
        message: `Conversión indirecta ARS → EUR realizada usando el inverso de EUR Blue (Venta). Fuente: ${item['Fuente']}, última actualización: ${item['Última Actualización']}.`,
      };
    }

    if (to === 'BRL') {
      const usdBlueVenta = data.find(
        (entry) =>
          entry['Actualizar Monedas Calculadora']['Par de MonedasR'] === 'USD Blue (Venta)',
      );

      if (!usdBlueVenta) {
        throw new BadRequestException('No se encontró tasa USD Blue (Venta).');
      }

      const usdItem = usdBlueVenta['Actualizar Monedas Calculadora'];
      const arsToUsdRate = 1 / usdItem['Valor']; // inverso

      const usdToBrl = data.find(
        (entry) => entry['Actualizar Monedas Calculadora']['Par de MonedasR'] === 'USD a BRL',
      );

      if (!usdToBrl) {
        throw new BadRequestException('No se encontró tasa USD → BRL.');
      }

      const brlItem = usdToBrl['Actualizar Monedas Calculadora'];
      const usdToBrlRate = brlItem['Valor'];
      const totalRate = arsToUsdRate * usdToBrlRate;
      const convertedAmount = amount * totalRate;

      return {
        from,
        to,
        amount,
        convertedAmount,
        rateUsed: totalRate,
        message: `Conversión indirecta ARS → BRL realizada en dos pasos (ARS→USD Blue Venta→BRL). Fuentes: ${usdItem['Fuente']}, ${brlItem['Fuente']}. Última actualización: ${brlItem['Última Actualización']}.`,
      };
    }

    throw new BadRequestException(`Conversión indirecta no implementada para ARS → ${to}`);
  }

  async convertBrlIndirect(dto: ConversionRequestDto): Promise<ConversionResponseDto> {
    const { from, to, amount } = dto;
    const data = await this.fetchData();

    if (from !== 'BRL' || to !== 'USD') {
      throw new BadRequestException(
        'Este método solo permite conversiones indirectas desde BRL hacia USD.',
      );
    }

    const usdItem = data.find(
      (entry) => entry['Actualizar Monedas Calculadora']['Par de MonedasR'] === 'USD a BRL',
    );

    if (!usdItem) {
      throw new BadRequestException('No se encontró tasa para USD.');
    }

    const item = usdItem['Actualizar Monedas Calculadora'];
    const rateUsed = 1 / item['Valor'];
    const convertedAmount = amount * rateUsed;

    return {
      from,
      to,
      amount,
      convertedAmount,
      rateUsed,
      message: `Conversión indirecta BRL → USD realizada usando el inverso de USD. Fuente: ${item['Fuente']}, última actualización: ${item['Última Actualización']}.`,
    };
  }
}
