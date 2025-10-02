

import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ConversionsService } from '../services/conversions.service';
import { ConversionRequestDto } from '../dto/conversion-request.dto';
import { ConversionResponseDto } from '../dto/conversion-response.dto';

@ApiTags('Conversions')
@Controller('conversions')
export class ConversionsController {
  constructor(private readonly conversionsService: ConversionsService) {}

  @Post()
  @HttpCode(200) 
  @ApiOperation({ summary: 'Convertir divisas' })
  @ApiResponse({ status: 200, type: ConversionResponseDto })
  async convert(
    @Body() request: ConversionRequestDto,
  ): Promise<ConversionResponseDto> {
    return this.conversionsService.convert(request);
  }
}



