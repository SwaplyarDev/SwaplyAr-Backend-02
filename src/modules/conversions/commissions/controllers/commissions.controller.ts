import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CommissionsService } from '../services/commissions.service';
import { CommissionRequestDto } from '../dto/commissions-request..dto';
import { CommissionResponseDto } from '../dto/commissions-response.dto';

@Controller('conversions/commissions')
@ApiTags('Commissions')
export class CommissionsController {
  constructor(private readonly commissionsService: CommissionsService) {}

  @Post()
  @ApiOperation({ summary: 'Calcula la comisión entre dos plataformas o medios de pago.' })
  @ApiResponse({
    status: 200,
    type: CommissionResponseDto,
    description: 'Comisión calculada correctamente.',
  })
  async calculateCommission(@Body() dto: CommissionRequestDto): Promise<CommissionResponseDto> {
    const { amount, from, to } = dto;
    return this.commissionsService.calculateCommission(amount, from, to);
  }
}
