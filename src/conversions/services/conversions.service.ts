

import { BadRequestException, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { ConversionRequestDto } from '../dto/conversion-request.dto';
import { ConversionResponseDto } from '../dto/conversion-response.dto';

@Injectable()
export class ConversionsService {
  constructor(private readonly httpService: HttpService) {}

  async convert(dto: ConversionRequestDto): Promise<ConversionResponseDto> {
    const { from, to, amount } = dto;

    const { data } = await firstValueFrom(
      this.httpService.get('https://script.googleusercontent.com/macros/echo?user_content_key=AehSKLihlS1hXH4UeaOUeMqpLzkOr8v0N-IeJx6Mpo1OAW7UBMZ4BDUJ17PvTacvkwGzpeUCkTSCcJy3jot43AwC_EWJ25z18UsQFAFsjgt3hhGITnPaulYvQjskL8gO5tps3WGGL1WCOMJQaUFzitTU3M9ftaO7bulOQ4ZHv6nYs2DiT6hvZzz8ZUUC8E95OlwU16HqWDW0CC4fcqxydTudnRwpY7R9NOJMJq5OOlFdc6k3gHyRiW_ImVdWSglbx42djFaYi5qqj87lwyNRKb4JqgoborKCTdiimjSecVNy&lib=MBnNMASRLKIGdM5hHuSWl31921_yAjuIT'),
    );

    const pairKey = `${from} a ${to}`;
    const found = data.find(
      (entry) => entry['Actualizar Monedas Calculadora']['Par de MonedasR'] === pairKey,
    );
    
    if (!found) {
      throw new BadRequestException(
        `No se encontró tasa para el par ${pairKey}`,
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
      message: `Conversión realizada correctamente (fuente: ${source}, última actualización: ${lastUpdated})`,
    };
  }
}



