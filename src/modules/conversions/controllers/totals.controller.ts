

import { Body, Controller, HttpCode, Post, BadRequestException, UseGuards } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ConversionsService } from '../services/conversions.service';
import { CommissionsService } from '../commissions/services/commissions.service';
import { ConversionTotalsResponseDto } from '../dto/conversions-totals-response.dto';
import { ConversionTotalRequestDto } from '../dto/conversions-total-request.dto';

@Controller('conversions/total')
@ApiTags('Conversions - Total Received')
export class TotalsController {
  constructor(
    private readonly conversionsService: ConversionsService,
    private readonly commissionsService: CommissionsService,
  ) {}

  @Post()
  @ApiOperation({
    summary:
      'Calcula el monto total recibido (maneja conversiones generales y especiales USD/EUR → ARS, incluyendo comisión y plataformas).',
  })
  @ApiResponse({
    status: 200,
    type: ConversionTotalsResponseDto,
    description: 'Conversión y comisión calculadas correctamente.',
  })
  @ApiBody({ type: ConversionTotalRequestDto })
  async calculateTotal(
    @Body() dto: ConversionTotalRequestDto,
  ): Promise<ConversionTotalsResponseDto> {
    const isArsConversion =
      (dto.from === 'USD' || dto.from === 'EUR') && dto.to === 'ARS';

    const conversion = isArsConversion && dto.operationType
      ? await this.conversionsService.convertArs({
          amount: dto.amount,
          from: dto.from,
          to: dto.to,
          operationType: dto.operationType,
        })
      : await this.conversionsService.convert({
          amount: dto.amount,
          from: dto.from,
          to: dto.to,
        });

    const commissionResult =
      this.commissionsService.calculateCommissionWithCurrencyCheck(
        conversion.convertedAmount,
        dto.fromPlatform,
        dto.toPlatform,
        dto.from,
        dto.to,
      );

    if (!commissionResult.valid) {
      throw new BadRequestException(
        `Las plataformas seleccionadas (${dto.fromPlatform} → ${dto.toPlatform}) no son coherentes con la conversión ${dto.from} → ${dto.to}. 
        Ajusta las plataformas para continuar.`,
      );
    }

    const commission = commissionResult.data!;
    const totalReceived = commission.finalAmount;

    return {
      ...conversion,
      commission,
      totalReceived,
      message: 'Conversión y comisión calculadas correctamente.',
      fromPlatform: dto.fromPlatform,
      toPlatform: dto.toPlatform,
    };
  }
}











