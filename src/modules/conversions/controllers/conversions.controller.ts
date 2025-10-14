import { Body, Controller, Post, BadRequestException, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
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
  @ApiResponse({ status: 201, type: ConversionResponseDto })
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
  @ApiResponse({ status: 201, type: ConversionResponseDto })
  async convertArs(@Body() request: ConversionRequestDto) {
    if (request.to !== 'ARS' || !(request.from === 'USD' || request.from === 'EUR')) {
      throw new BadRequestException(
        `Este endpoint solo permite conversiones desde USD o EUR hacia ARS.`,
      );
    }

    return this.conversionsService.convertArs(request);
  }

  @Post('ars/indirect')
  @ApiOperation({ summary: 'Convertir ARS → EUR/USD/BRL (con cálculo indirecto, venta)' })
  @ApiResponse({ status: 201, type: ConversionResponseDto })
  async convertArsIndirect(@Body() request: ConversionRequestDto) {
    if (request.from !== 'ARS' || !['EUR', 'USD', 'BRL'].includes(request.to)) {
      throw new BadRequestException(
        `Este endpoint solo permite conversiones desde ARS hacia EUR, USD o BRL.`,
      );
    }

    return this.conversionsService.convertArsIndirect(request);
  }
}
