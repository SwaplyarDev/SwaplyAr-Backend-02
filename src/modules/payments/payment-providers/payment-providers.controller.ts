import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';
import { PaymentProvidersService } from './payment-providers.service';
import { CreatePaymentProvidersDto } from './dto/create-payment-providers.dto';
import { UpdatePaymentProvidersDto } from './dto/update-payment-providers.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

@ApiTags('Payment Providers')
@Controller('payment-providers')
export class PaymentProvidersController {
  constructor(private readonly service: PaymentProvidersService) {}
  // ===============================================
  // MOSTRAR TODAS LOS PROVEEDORES DE PAGO
  // ===============================================
  @ApiOperation({ summary: 'Obtener todos los proveedores de pago' })
  @ApiResponse({ status: 200, description: 'Lista de providers obtenida con éxito' })
  @Get()
  findAll() {
    return this.service.findAll();
  }

  // ===============================================
  // MOSTRAR PROVEEDORES DE PAGO POR ID
  // ===============================================
  @ApiOperation({ summary: 'Obtener un proveedor de pago por ID' })
  @ApiResponse({ status: 200, description: 'Provider obtenido' })
  @ApiResponse({ status: 404, description: 'Provider no encontrado' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  // ===============================================
  // CREAR UN PROVEEDOR DE PAGO
  // ===============================================
  @ApiOperation({ summary: 'Crear un nuevo proveedor de pago' })
  @ApiResponse({ status: 201, description: 'Provider creado con éxito' })
  @Post()
  create(@Body() dto: CreatePaymentProvidersDto) {
    return this.service.create(dto);
  }

  // ===============================================
  // ACTUALIZAR UN PROVEEDOR DE PAGO
  // ===============================================
  @ApiOperation({ summary: 'Actualizar un proveedor de pago' })
  @ApiResponse({ status: 200, description: 'Provider actualizado con éxito' })
  @ApiBody({ type: UpdatePaymentProvidersDto })
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdatePaymentProvidersDto) {
    return this.service.update(id, dto);
  }

  // ===============================================
  // ELIMINAR UN PROVEEDOR DE PAGO
  // ===============================================
  @ApiOperation({ summary: 'Eliminar un proveedor de pago' })
  @ApiResponse({ status: 200, description: 'Provider eliminado' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }

  // ===============================================
  // INACTIVAR (SOFT-DELETE) UN PROVEEDOR DE PAGO
  // ===============================================
  @ApiOperation({ summary: 'Inactivar un proveedor de pago' })
  @ApiResponse({ status: 200, description: 'Provider inactivado con éxito' })
  @Patch(':id/inactivate')
  inactivate(@Param('id') id: string) {
    return this.service.inactivate(id);
  }
}
