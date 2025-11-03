import { Body, Controller, Post, BadRequestException } from '@nestjs/common';
import { ApiBody, ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
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
      'Calcula el monto total recibido (maneja conversiones generales y especiales USD/EUR ↔ ARS o ARS ↔ EUR/USD/BRL, incluyendo comisión y plataformas).',
  })
  @ApiCreatedResponse({
    type: ConversionTotalsResponseDto,
    description: 'Conversión y comisión calculadas correctamente.',
  })
  @ApiBody({ type: ConversionTotalRequestDto })
  async calculateTotal(
    @Body() dto: ConversionTotalRequestDto,
  ): Promise<ConversionTotalsResponseDto> {
    const isToArs = dto.to === 'ARS' && (dto.from === 'USD' || dto.from === 'EUR');
    const isFromArs = dto.from === 'ARS' && ['USD', 'EUR', 'BRL'].includes(dto.to);

    let conversion;

    if (isToArs) {
      conversion = await this.conversionsService.convertArs({
        amount: dto.amount,
        from: dto.from,
        to: dto.to,
      });
    } else if (isFromArs) {
      conversion = await this.conversionsService.convertArsIndirect({
        amount: dto.amount,
        from: dto.from,
        to: dto.to,
      });
    } else {
      conversion = await this.conversionsService.convert({
        amount: dto.amount,
        from: dto.from,
        to: dto.to,
      });
    }

    const commissionResult = await this.commissionsService.calculateCommissionWithCurrencyCheck(
      conversion.convertedAmount,
      dto.fromPlatform,
      dto.toPlatform,
      dto.from,
      dto.to,
    );

    if (!commissionResult.valid) {
      throw new BadRequestException(
        `No se encontró una comisión válida para la combinación ${dto.fromPlatform} → ${dto.toPlatform} 
        en la conversión ${dto.from} → ${dto.to}. Verifica que la regla esté creada o que las plataformas sean coherentes.`,
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
