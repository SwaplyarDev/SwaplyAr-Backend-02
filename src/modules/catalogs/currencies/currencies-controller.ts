import { Controller, Get, Post, Patch, Param, Body, Put } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CurrenciesService } from './currencies-service';
import { Currency } from './currencies.entity';

@ApiTags('Currencies')
@ApiBearerAuth()
@Controller('currencies')
export class CurrenciesController {
  constructor(private readonly currenciesService: CurrenciesService) {}

  @Get()
  @ApiOperation({ summary: 'List all currencies' })
  findAll(): Promise<Currency[]> {
    return this.currenciesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get currency by id' })
  findOne(@Param('id') id: string): Promise<Currency> {
    return this.currenciesService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create currency' })
  create(@Body() body: Partial<Currency>): Promise<Currency> {
    return this.currenciesService.create(body);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update currency' })
  update(@Param('id') id: string, @Body() body: Partial<Currency>): Promise<Currency> {
    return this.currenciesService.update(id, body);
  }

  @Patch(':id/active')
  @ApiOperation({ summary: 'Activate / deactivate currency' })
  toggle(@Param('id') id: string, @Body('isActive') isActive: boolean): Promise<Currency> {
    return this.currenciesService.toggle(id, isActive);
  }

  @Put(':id/countries')
  @ApiOperation({ summary: 'Assign countries to currency' })
  assignCountries(
    @Param('id') id: string,
    @Body('countryIds') countryIds: string[],
  ): Promise<Currency> {
    return this.currenciesService.assignCountries(id, countryIds);
  }
}
