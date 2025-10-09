

import { Body, Controller, Post, BadRequestException, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ConversionsService } from '../services/conversions.service';
import { ConversionRequestDto } from '../dto/conversions-request.dto';
import { ConversionResponseDto } from '../dto/conversions-response.dto';
import { ConversionArsRequestDto } from '../dto/conversions-request-Ars.dto';

@Controller('conversions')
@ApiTags('Conversions')

export class ConversionsController {
  constructor(
    private readonly conversionsService: ConversionsService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Convertir divisas y/o monedas (excepto USD/EUR → ARS)' })
  @ApiResponse({ status: 200, type: ConversionResponseDto })
  async convert(@Body() request: ConversionRequestDto) {
    if (request.to === 'ARS' && (request.from === 'USD' || request.from === 'EUR')) {
      throw new BadRequestException(
        `Para convertir ${request.from} → ${request.to} debes usar el endpoint /conversions/ars con operación (Compra/Venta).`,
      );
    }

    return this.conversionsService.convert(request);
  }

  @Post('ars')
  @ApiOperation({ summary: 'Convertir USD/EUR → ARS con modalidad (Compra/Venta)' })
  @ApiResponse({ status: 200, type: ConversionResponseDto })
  async convertArs(@Body() request: ConversionArsRequestDto) {
    if (request.to !== 'ARS' || !(request.from === 'USD' || request.from === 'EUR')) {
      throw new BadRequestException(
        `Este endpoint solo permite conversiones desde USD o EUR hacia ARS.`,
      );
    }

    return this.conversionsService.convertArs(request);
  }
}
