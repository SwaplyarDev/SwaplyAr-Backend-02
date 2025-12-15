import { Controller, Get, Post, Put, Body, Param, Patch, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiOkResponse, ApiBearerAuth } from '@nestjs/swagger';
import { CountriesService } from './country.service';
import { CreateCountryDto } from './dto/create-countries.dto';
import { UpdateCountryDto } from './dto/update-countries.dto';
import { CountryResponseDto } from './dto/countries-response.dto';
import { AssignCurrenciesDto } from './dto/assign-currencies.dto';
import { Countries } from './countries.entity';
import { JwtAuthGuard } from '@common/jwt-auth.guard';
import { RolesGuard } from '@common/guards/roles.guard';
import { Roles } from '@common/decorators/roles.decorator';

@ApiTags('Countries')
@Controller('countries')
export class CountriesController {
  constructor(private readonly countriesService: CountriesService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('user', 'admin')
  @Get()
  @ApiOperation({ summary: 'Obtener todos los países' })
  @ApiOkResponse({ type: [CountryResponseDto] })
  async findAll() {
    return this.countriesService.findAll();
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Post()
  @ApiOperation({ summary: 'Crear nuevo país' })
  @ApiOkResponse({ type: CountryResponseDto })
  async create(@Body() createDto: CreateCountryDto) {
    return this.countriesService.create(createDto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('user', 'admin')
  @Get(':id')
  @ApiOperation({ summary: 'Obtener país por ID' })
  @ApiOkResponse({ type: CountryResponseDto })
  async findOne(@Param('id') id: string) {
    return this.countriesService.findOne(id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar país' })
  @ApiOkResponse({ type: CountryResponseDto })
  async update(@Param('id') id: string, @Body() updateDto: UpdateCountryDto) {
    return this.countriesService.update(id, updateDto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar país' })
  async remove(@Param('id') id: string) {
    return this.countriesService.remove(id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Put(':id/currencies')
  @ApiOperation({ 
    summary: 'Asignar monedas al país',
    description: 'Para obtener los IDs de monedas disponibles, usar GET /currencies'
  })
  @ApiOkResponse({ type: CountryResponseDto })
  assignCurrencies(
    @Param('id') id: string,
    @Body() assignDto: AssignCurrenciesDto,
  ): Promise<Countries> {
    return this.countriesService.assignCurrencies(id, assignDto.currencyIds);
  }
}
