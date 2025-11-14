import { Body, Controller, Post, BadRequestException } from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ConversionsService } from '../services/conversions.service';
import { ConversionRequestDto } from '../dto/conversions-request.dto';
import { ConversionResponseDto } from '../dto/conversions-response.dto';

@Controller('conversions')
@ApiTags('Conversions')
export class ConversionsController {
  constructor(private readonly conversionsService: ConversionsService) {}

  @Post()
  @ApiOperation({
    summary: 'Convertir divisas y/o monedas (excepto EUR/USD → ARS o ARS → EUR/ARS/BRL)',
  })
  @ApiCreatedResponse({ type: ConversionResponseDto })
  async convert(@Body() request: ConversionRequestDto) {
    if (request.to === 'ARS' && (request.from === 'USD' || request.from === 'EUR')) {
      throw new BadRequestException(
        `Para convertir ${request.from} → ${request.to} debes usar el endpoint /conversions/ars.`,
      );
    }

    if (request.from === 'ARS' && ['EUR', 'USD', 'BRL'].includes(request.to)) {
      throw new BadRequestException(
        `Para convertir ${request.from} → ${request.to} debes usar el endpoint /conversions/ars/indirect.`,
      );
    }

    return this.conversionsService.convert(request);
  }

  @Post('ars')
  @ApiOperation({ summary: 'Convertir EUR/USD → ARS con modalidad (compra)' })
  @ApiCreatedResponse({ type: ConversionResponseDto })
  async convertArs(@Body() request: ConversionRequestDto) {
    if (request.to !== 'ARS' || !(request.from === 'USD' || request.from === 'EUR')) {
      throw new BadRequestException(
        `Este endpoint solo permite conversiones desde USD o EUR hacia ARS.`,
      );
    }

    return this.conversionsService.convertArs(request);
  }

  @Post('indirect')
  @ApiOperation({
    summary: 'Convertir ARS → EUR/USD/BRL o BRL → USD  (con cálculo indirecto, venta (ARS))' 
  })
  @ApiCreatedResponse({ type: ConversionResponseDto })
  async convertIndirect(@Body() request: ConversionRequestDto) {
    const { from, to } = request;
    const validPairs = [
      ['ARS', 'EUR'],
      ['ARS', 'USD'],
      ['ARS', 'BRL'],
      ['BRL', 'USD'],
    ];

    const isValid = validPairs.some(([f, t]) => f === from && t === to);

    if (!isValid) {
      throw new BadRequestException(
        'Este endpoint solo permite conversiones indirectas desde ARS hacia EUR/USD/BRL o desde BRL hacia USD.',
      );
    }

    if (from === 'ARS') {
      return this.conversionsService.convertArsIndirect(request);
    } else if (from === 'BRL') {
      return this.conversionsService.convertBrlIndirect(request);
    }
  }
}