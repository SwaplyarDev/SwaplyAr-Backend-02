import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';
import { PaymentPlatformsService } from './payment-platforms.service';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { CreatePaymentPlatformsDto } from './dto/create-payment-platforms.dto';
import { UpdatePaymentPlatformsDto } from './dto/update-payment-platforms.dto';

@ApiTags('Payment Platforms')
@Controller('payment-platforms')
export class PaymentPlatformsController {
  constructor(private readonly service: PaymentPlatformsService) {}

  // ===============================================
  // MOSTRAR TODAS LAS PLATAFORMAS DE PAGO
  // ===============================================
  @ApiOperation({ summary: 'Obtener todas las plataformas de pago registradas' })
  @ApiResponse({ status: 200, description: 'Lista de plataformas de pago obtenida correctamente.' })
  @Get()
  findAll() {
    return this.service.findAll();
  }

  // ===============================================
  // MOSTRAR UNA PLATAFORMA DE PAGO POR ID
  // ===============================================
  @ApiOperation({ summary: 'Obtener plataformas de pago por ID' })
  @ApiResponse({ status: 200, description: 'Plataforma de pago obtenida correctamente.' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  // ===============================================
  // CREAR UNA PLATAFORMA DE PAGO
  // ===============================================
  @ApiOperation({ summary: 'Crear una plataforma de pago' })
  @ApiResponse({ status: 200, description: 'Plataforma de pago creada correctamente.' })
  @Post()
  create(@Body() data: CreatePaymentPlatformsDto) {
    return this.service.create(data);
  }

  // ===============================================
  // ACTUALIZAR UNA PLATAFORMA DE PAGO
  // ===============================================
  @ApiOperation({ summary: 'Actualizar una plataforma de pago' })
  @ApiResponse({ status: 200, description: 'Plataforma de pago actualizada correctamente.' })
  @ApiBody({ type: UpdatePaymentPlatformsDto })
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdatePaymentPlatformsDto) {
    return this.service.update(id, dto);
  }
  // ===============================================
  // INACTIVAR (SOFT-DELETE) UNA PLATAFORMA DE PAGO
  // ===============================================
  @ApiOperation({ summary: 'Inactivar una plataforma de pago' })
  @ApiResponse({ status: 200, description: 'Plataforma de pago inactivada correctamente.' })
  @Patch(':id/inactivate')
  inactivate(@Param('id') id: string) {
    return this.service.inactivate(id);
  }
  // ===============================================
  // BORRAR UNA PLATAFORMA DE PAGO
  // ===============================================
  @ApiOperation({ summary: 'Eliminar una plataforma de pago' })
  @ApiResponse({ status: 200, description: 'Plataforma de pago eliminada correctamente.' })
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.service.delete(id);
  }
}
