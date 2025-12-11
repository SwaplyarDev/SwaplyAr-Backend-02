import { Controller, Get, Post, Body, Param, Patch, Delete, UseGuards, Query } from '@nestjs/common';
import { PaymentPlatformsService } from './payment-platforms.service';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { CreatePaymentPlatformsDto } from './dto/create-payment-platforms.dto';
import { UpdatePaymentPlatformsDto } from './dto/update-payment-platforms.dto';
import { PaymentPlatformResponseDto } from './dto/payment-platforms-response.dto';
import { PaymentPlatformFilterDto } from './dto/payment-platform-filter.dto';
import { JwtAuthGuard } from '../../../common/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';

@ApiTags('Payment Platforms')
@Controller('payment-platforms')
export class PaymentPlatformsController {
  constructor(private readonly service: PaymentPlatformsService) {}

  // ===============================================
  // MOSTRAR TODAS LAS PLATAFORMAS DE PAGO
  // ===============================================
  @ApiOperation({ summary: 'Obtener todas las plataformas de pago registradas (con filtros opcionales)' })
  @ApiResponse({
    status: 200,
    description: 'Lista de plataformas de pago obtenida correctamente.',
    type: [PaymentPlatformResponseDto],
  })
  @Get()
  findAll(@Query() filters: PaymentPlatformFilterDto) {
    return this.service.findAll(filters);
  }

  // ===============================================
  // MOSTRAR UNA PLATAFORMA DE PAGO POR ID
  // ===============================================
  @ApiOperation({ summary: 'Obtener plataformas de pago por ID' })
  @ApiResponse({
    status: 200,
    description: 'Plataforma de pago obtenida correctamente.',
    type: PaymentPlatformResponseDto,
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  // ===============================================
  // CREAR UNA PLATAFORMA DE PAGO
  // ===============================================
  @ApiOperation({ summary: 'Crear una plataforma de pago' })
  @ApiResponse({
    status: 201,
    description: 'Plataforma de pago creada correctamente.',
    type: PaymentPlatformResponseDto,
  })
  @ApiBody({ type: CreatePaymentPlatformsDto })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Post()
  create(@Body() data: CreatePaymentPlatformsDto) {
    return this.service.create(data);
  }

  // ===============================================
  // ACTUALIZAR UNA PLATAFORMA DE PAGO
  // ===============================================
  @ApiOperation({ summary: 'Actualizar una plataforma de pago' })
  @ApiResponse({
    status: 200,
    description: 'Plataforma de pago actualizada correctamente.',
    type: PaymentPlatformResponseDto,
  })
  @ApiBody({ type: UpdatePaymentPlatformsDto })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdatePaymentPlatformsDto) {
    return this.service.update(id, dto);
  }
  // ===============================================
  // INACTIVAR (SOFT-DELETE) UNA PLATAFORMA DE PAGO
  // ===============================================
  @ApiOperation({ summary: 'Inactivar una plataforma de pago' })
  @ApiResponse({
    status: 200,
    description: 'Plataforma de pago inactivada correctamente.',
    type: PaymentPlatformResponseDto,
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Patch(':id/deactivate')
  inactivate(@Param('id') id: string) {
    return this.service.inactivate(id);
  }
  // ===============================================
  // BORRAR UNA PLATAFORMA DE PAGO
  // ===============================================
  @ApiOperation({ summary: 'Eliminar una plataforma de pago' })
  @ApiResponse({ status: 200, description: 'Plataforma de pago eliminada correctamente.' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.service.delete(id);
  }
}
