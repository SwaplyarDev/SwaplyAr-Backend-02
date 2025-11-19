// import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';
// import { PaymentProvidersService } from './payment-providers.service';
// import { CreatePaymentProvidersDto } from './dto/create-payment-providers.dto';
// import { UpdatePaymentProvidersDto } from './dto/update-payment-providers.dto';
// import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

// @ApiTags('Payment Providers')
// @Controller('payment-providers')
// export class PaymentProvidersController {
//   constructor(private readonly service: PaymentProvidersService) {}

//   @Get()
//   @ApiOperation({ summary: 'Obtener todos los payment providers' })
//   @ApiResponse({ status: 200, description: 'Lista de providers obtenida con éxito' })
//   findAll() {
//     return this.service.findAll();
//   }

//   @Get(':id')
//   @ApiOperation({ summary: 'Obtener un payment provider por ID' })
//   @ApiResponse({ status: 200, description: 'Provider obtenido' })
//   @ApiResponse({ status: 404, description: 'Provider no encontrado' })
//   findOne(@Param('id') id: string) {
//     return this.service.findOne(id);
//   }

//   @Post()
//   @ApiOperation({ summary: 'Crear un nuevo payment provider' })
//   @ApiResponse({ status: 201, description: 'Provider creado con éxito' })
//   create(@Body() dto: CreatePaymentProvidersDto) {
//     return this.service.create(dto);
//   }

//   @Patch(':id')
//   @ApiOperation({ summary: 'Actualizar un payment provider' })
//   @ApiResponse({ status: 200, description: 'Provider actualizado con éxito' })
//   update(@Param('id') id: string, @Body() dto: UpdatePaymentProvidersDto) {
//     return this.service.update(id, dto);
//   }

//   @Delete(':id')
//   @ApiOperation({ summary: 'Eliminar un payment provider' })
//   @ApiResponse({ status: 200, description: 'Provider eliminado' })
//   remove(@Param('id') id: string) {
//     return this.service.remove(id);
//   }
// }
