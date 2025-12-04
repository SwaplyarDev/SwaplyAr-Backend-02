import { Controller, Post, Patch, Get, Body, Query, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiQuery,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { DynamicCommissionsService } from '../services/dynamicCommissions.service';
import { CreateDynamicCommissionDto } from '../dto/create-dynamic-commission.dto';
import { UpdateDynamicCommissionDto } from '../dto/update-dynamic-commission.dto';
import { DynamicCommissionResponseDto } from '../dto/dynamic-commission-response.dto';
import { PlatformName } from 'src/enum/commissions.enum';
import { JwtAuthGuard } from '@common/jwt-auth.guard';
import { RolesGuard } from '@common/guards/roles.guard';
import { Roles } from '@common/decorators/roles.decorator';

@ApiTags('Dynamic Commissions')
@Controller('dynamic-commissions')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
export class DynamicCommissionsController {
  constructor(private readonly dynamicCommissionsService: DynamicCommissionsService) {}

  @Post('/admin')
  @Roles('admin', 'super_admin')
  @ApiOperation({ summary: 'Crear una nueva comisión entre plataformas' })
  @ApiBody({ type: CreateDynamicCommissionDto })
  @ApiCreatedResponse({
    description: 'Comisión creada exitosamente.',
    type: DynamicCommissionResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Datos inválidos o combinación de plataformas duplicada.',
  })
  async create(@Body() body: CreateDynamicCommissionDto): Promise<DynamicCommissionResponseDto> {
    return this.dynamicCommissionsService.create(body);
  }

  @Patch('/admin')
  @Roles('admin', 'super_admin')
  @ApiOperation({
    summary: 'Actualizar la tasa de comisión entre dos plataformas',
  })
  @ApiBody({ type: UpdateDynamicCommissionDto })
  @ApiOkResponse({
    description: 'Comisión actualizada correctamente.',
    type: DynamicCommissionResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'No se encontró la comisión a actualizar.',
  })
  @ApiBadRequestResponse({
    description: 'Datos inválidos o combinación de plataformas duplicada.',
  })
  async update(@Body() body: UpdateDynamicCommissionDto): Promise<DynamicCommissionResponseDto> {
    return this.dynamicCommissionsService.update(body);
  }

  @Get('/admin')
  @Roles('admin', 'super_admin')
  @ApiOperation({ summary: 'Obtener comisiones (todas o filtradas por cruce)' })
  @ApiQuery({
    name: 'fromPlatform',
    required: false,
    enum: PlatformName,
    description: 'Filtrar por plataforma origen',
  })
  @ApiQuery({
    name: 'toPlatform',
    required: false,
    enum: PlatformName,
    description: 'Filtrar por plataforma destino',
  })
  @ApiOkResponse({
    description: 'Listado de comisiones disponibles.',
    type: [DynamicCommissionResponseDto],
  })
  async find(
    @Query('fromPlatform') fromPlatform?: PlatformName,
    @Query('toPlatform') toPlatform?: PlatformName,
  ): Promise<DynamicCommissionResponseDto[]> {
    return this.dynamicCommissionsService.find(fromPlatform, toPlatform);
  }
}
