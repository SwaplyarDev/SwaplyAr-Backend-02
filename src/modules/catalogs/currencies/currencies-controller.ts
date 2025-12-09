import { Controller, Get, Post, Patch, Param, Body, Put, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiOkResponse, ApiBearerAuth } from '@nestjs/swagger';
import { CurrenciesService } from './currencies-service';
import { Currency } from './currencies.entity';
import { CreateCurrencyDto } from './dto/create-currencies.dto';
import { UpdateCurrencyDto } from './dto/update-currencies.dto';
import { CurrencyResponseDto } from './dto/currencies-response.dto';
import { JwtAuthGuard } from '@common/jwt-auth.guard';
import { RolesGuard } from '@common/guards/roles.guard';
import { Roles } from '@common/decorators/roles.decorator';

@ApiTags('Currencies')
@Controller('currencies')
export class CurrenciesController {
  constructor(private readonly currenciesService: CurrenciesService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('user', 'admin')
  @Get()
  @ApiOperation({ summary: 'Obtener todas las monedas' })
  @ApiOkResponse({ type: [CurrencyResponseDto] })
  async findAll(): Promise<Currency[]> {
    return this.currenciesService.findAll();
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('user', 'admin')
  @Get(':id')
  @ApiOperation({ summary: 'Obtener monerda por id' })
  @ApiOkResponse({ type: [CurrencyResponseDto] })
  async findOne(@Param('id') id: string): Promise<Currency> {
    return this.currenciesService.findOne(id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Post()
  @ApiOperation({ summary: 'Crear moneda' })
  @ApiOkResponse({ type: [CurrencyResponseDto] })
  async create(@Body() body: CreateCurrencyDto): Promise<Currency> {
    return this.currenciesService.create(body);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar moneda' })
  @ApiOkResponse({ type: [CurrencyResponseDto] })
  async update(@Param('id') id: string, @Body() body: UpdateCurrencyDto): Promise<Currency> {
    return this.currenciesService.update(id, body);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Patch(':id/active')
  @ApiOperation({ summary: 'activar/desactivar moneda' })
  @ApiOkResponse({ type: [CurrencyResponseDto] })
  async toggle(@Param('id') id: string, @Body('isActive') isActive: boolean): Promise<Currency> {
    return this.currenciesService.toggle(id, isActive);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Put(':id/countries')
  @ApiOperation({ summary: 'Asignar paises a la moneda' })
  @ApiOkResponse({ type: [CurrencyResponseDto] })
  async assignCountries(
    @Param('id') id: string,
    @Body('countryIds') countryIds: string[],
  ): Promise<Currency> {
    return this.currenciesService.assignCountries(id, countryIds);
  }
}
