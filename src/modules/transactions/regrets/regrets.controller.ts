import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RegretsService } from './regrets.service';
import { CreateRegretDto } from './dto/create-regret.dto';
import { UpdateRegretDto } from './dto/update-regret.dto';
import { RegretDto } from './dto/regret-response-dto';

import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiParam,
  ApiOkResponse,
  ApiCreatedResponse,
} from '@nestjs/swagger';

@ApiTags('Regrets')
@Controller('regrets')
export class RegretsController {
  constructor(private readonly regretsService: RegretsService) {}

  @ApiOperation({ summary: 'Crear un arrepentimiento de transacción' })
  @ApiCreatedResponse({
    description: 'Arrepentimiento creado correctamente',
    type: RegretDto,
  })
  @ApiBody({
    description: 'Datos para crear un arrepentimiento',
    type: CreateRegretDto,
  })
  @Post()
  create(@Body() createRegretDto: CreateRegretDto) {
    return this.regretsService.create(createRegretDto);
  }

  @ApiOperation({ summary: 'Obtener todos los arrepentimientos' })
  @ApiOkResponse({
    description: 'Lista de arrepentimientos',
    type: [RegretDto],
  })
  @Get()
  findAll() {
    return this.regretsService.findAll();
  }

  @ApiOperation({ summary: 'Obtener un arrepentimiento por ID' })
  @ApiOkResponse({
    description: 'Arrepentimiento encontrado',
    type: RegretDto,
  })
  @ApiParam({
    name: 'id',
    description: 'ID del arrepentimiento',
    example: 'uuid',
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.regretsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRegretDto: UpdateRegretDto) {
    return this.regretsService.update(id, updateRegretDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.regretsService.remove(id);
  }
}
