import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';
import { PaymentPlatformsService } from './payment-platforms.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreatePaymentPlatformDto } from './dto/create-payment-platforms.dto';

@ApiTags('Payment Platforms')
@Controller('payment-platforms')
export class PaymentPlatformsController {
  constructor(private readonly service: PaymentPlatformsService) {}

  // ===============================================
  // GET ALL PAYMENT PLATFORMS
  // ===============================================
  @ApiOperation({ summary: 'Obtener todas las plataformas de pago registradas' })
  @ApiResponse({ status: 200, description: 'Lista de plataformas de pago obtenida correctamente.' })
  @Get()
  findAll() {
    return this.service.findAll();
  }

  // ===============================================
  // GET PAYMENT PLATFORMS BY ID
  // ===============================================
  @ApiOperation({ summary: 'Obtener plataformas de pago por ID' })
  @ApiResponse({ status: 200, description: 'Plataforma de pago obtenida correctamente.' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  // ===============================================
  // CREATE A PAYMENT PLATFORM
  // ===============================================
  @ApiOperation({ summary: 'Crear una plataforma de pago' })
  @ApiResponse({ status: 200, description: 'Plataforma de pago creada correctamente.' })
  @Post()
  create(@Body() data: CreatePaymentPlatformDto) {
    return this.service.create(data);
  }

  // ===============================================
  // UPDATE A PAYMENT PLATFORM
  // ===============================================
  @ApiOperation({ summary: 'Actualizar una plataforma de pago' })
  @ApiResponse({ status: 200, description: 'Plataforma de pago actualizada correctamente.' })
  @Patch(':id')
  update(@Param('id') id: string, @Body() data: any) {
    return this.service.update(id, data);
  }

  // ===============================================
  // DELETE A PAYMENT PLATFORM
  // ===============================================
  @ApiOperation({ summary: 'Eliminar una plataforma de pago' })
  @ApiResponse({ status: 200, description: 'Plataforma de pago eliminada correctamente.' })
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.service.delete(id);
  }
}
