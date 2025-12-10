import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import { PaymentProvidersService } from './payment-providers.service';
import { CreatePaymentProvidersDto } from './dto/create-payment-providers.dto';
import { UpdatePaymentProvidersDto } from './dto/update-payment-providers.dto';
import { MyAvailableProvidersFilterDto } from './dto/payment-providers-filter.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '@common/jwt-auth.guard';
import { RolesGuard } from '@common/guards/roles.guard';
import { Roles } from '@common/decorators/roles.decorator';
@ApiTags('Payment Providers')
@Controller('payment-providers')
export class PaymentProvidersController {
  constructor(private readonly service: PaymentProvidersService) {}
  // ===============================================
  // MOSTRAR PROVEEDORES DE PAGO DISPONBLES PARA UN USUARIO
  // ===============================================
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'user')
  @Get('my-available')
  @ApiOperation({
    summary:
      'Obtiene los providers disponibles para el usuario según las cuentas asociadas a su perfil',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de providers disponibles para el usuario',
  })
  findMyAvailableProviders(@Req() req, @Query() filters: MyAvailableProvidersFilterDto) {
    return this.service.getMyAvailableProviders(req.user.id, filters);
  }

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
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
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
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdatePaymentProvidersDto) {
    return this.service.update(id, dto);
  }

  // ===============================================
  // ELIMINAR UN PROVEEDOR DE PAGO
  // ===============================================
  @ApiOperation({ summary: 'Eliminar un proveedor de pago' })
  @ApiResponse({ status: 200, description: 'Provider eliminado' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }

  // ===============================================
  // INACTIVAR (SOFT-DELETE) UN PROVEEDOR DE PAGO
  // ===============================================
  @ApiOperation({ summary: 'Inactivar un proveedor de pago y sus cuentas relacionadas' })
  @ApiResponse({ status: 200, description: 'Provider inactivado con éxito' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Patch(':id/deactivate')
  inactivate(@Param('id') id: string) {
    return this.service.inactivate(id);
  }
}
