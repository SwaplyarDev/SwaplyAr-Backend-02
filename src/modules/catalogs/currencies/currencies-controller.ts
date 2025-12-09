import { Controller, Get, Post, Patch, Param, Body, Put } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { CurrenciesService } from './currencies-service';
import { Currency } from './currencies.entity';
import { CreateCurrencyDto } from './dto/create-currencies.dto';
import { UpdateCurrencyDto } from './dto/update-currencies.dto';

@ApiTags('Currencies')
@ApiBearerAuth()
@Controller('currencies')
export class CurrenciesController {
  constructor(private readonly currenciesService: CurrenciesService) {}

  @Get()
  @ApiOperation({ summary: 'Obtener todas las monedas' })
  @ApiResponse({ status: 200, description: 'Lista de monedas', type: [Currency] })
  findAll(): Promise<Currency[]> {
    return this.currenciesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener monerda por id' })
  findOne(@Param('id') id: string): Promise<Currency> {
    return this.currenciesService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Crear moneda' })
  create(@Body() body: CreateCurrencyDto): Promise<Currency> {
    return this.currenciesService.create(body);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar moneda' })
  update(@Param('id') id: string, @Body() body: UpdateCurrencyDto): Promise<Currency> {
    return this.currenciesService.update(id, body);
  }

  @Patch(':id/active')
  @ApiOperation({ summary: 'activar/desactivar moneda' })
  toggle(@Param('id') id: string, @Body('isActive') isActive: boolean): Promise<Currency> {
    return this.currenciesService.toggle(id, isActive);
  }

  @Put(':id/countries')
  @ApiOperation({ summary: 'Asignar paises a la moneda' })
  assignCountries(
    @Param('id') id: string,
    @Body('countryIds') countryIds: string[],
  ): Promise<Currency> {
    return this.currenciesService.assignCountries(id, countryIds);
  }
}
