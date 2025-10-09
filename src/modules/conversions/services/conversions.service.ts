import { BadRequestException, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { ConversionRequestDto } from '../dto/conversions-request.dto';
import { ConversionResponseDto } from '../dto/conversions-response.dto';
import { ConversionArsRequestDto } from '../dto/conversions-request-Ars.dto';
import { ArsOperationType } from '../../../enum/ars-operation-type.enum';
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

  async convertArs(dto: ConversionArsRequestDto): Promise<ConversionResponseDto> {
    const { from, to, amount, operationType } = dto;
    const data = await this.fetchData();

    const operationLabel = operationType === ArsOperationType.Compra ? 'Compra' : 'Venta';

    const key = from === 'USD' ? `USD Blue (${operationLabel})` : `EUR Blue (${operationLabel})`;

    const found = data.find(
      (entry) => entry['Actualizar Monedas Calculadora']['Par de MonedasR'] === key,
    );

    if (!found) {
      throw new BadRequestException(
        `No se encontró tasa para ${from} → ${to} en modalidad Blue (${operationType}).`,
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
}
