

import { BadRequestException, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { ConversionRequestDto } from '../dto/conversions-request.dto';
import { ConversionResponseDto } from '../dto/conversions-response.dto';
import { ConversionArsRequestDto } from '../dto/conversions-request-Ars.dto';
import { ArsOperationType } from '../../enum/ars-operation-type.enum';

@Injectable()
export class ConversionsService {
  constructor(private readonly httpService: HttpService) {}

  private async fetchData() {
    const { data } = await firstValueFrom(
      this.httpService.get(
        'https://script.googleusercontent.com/macros/echo?user_content_key=AehSKLihlS1hXH4UeaOUeMqpLzkOr8v0N-IeJx6Mpo1OAW7UBMZ4BDUJ17PvTacvkwGzpeUCkTSCcJy3jot43AwC_EWJ25z18UsQFAFsjgt3hhGITnPaulYvQjskL8gO5tps3WGGL1WCOMJQaUFzitTU3M9ftaO7bulOQ4ZHv6nYs2DiT6hvZzz8ZUUC8E95OlwU16HqWDW0CC4fcqxydTudnRwpY7R9NOJMJq5OOlFdc6k3gHyRiW_ImVdWSglbx42djFaYi5qqj87lwyNRKb4JqgoborKCTdiimjSecVNy&lib=MBnNMASRLKIGdM5hHuSWl31921_yAjuIT'
      ),
    );
    return data;
  }

  async convert(dto: ConversionRequestDto): Promise<ConversionResponseDto> {
    const { from, to, amount } = dto;
    const data = await this.fetchData();

    const pairKey = `${from} a ${to}`;
    const found = data.find(
      (entry) =>
        entry['Actualizar Monedas Calculadora']['Par de MonedasR'] === pairKey,
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

  const operationLabel =
    operationType === ArsOperationType.Compra ? 'Compra' : 'Venta';

  const key =
    from === 'USD'
      ? `USD Blue (${operationLabel})`
      : `EUR Blue (${operationLabel})`;

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







