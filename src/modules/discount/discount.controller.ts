enum UserRoles {
  USER = 'user',
  ADMIN = 'admin',
  SUPER_ADMIN = 'super_admin',
}

import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { DiscountService } from './discount.service';
import { CreateDiscountDto } from './dto/create-discount.dto';
import { FilterUserDiscountsDto } from './dto/filter-user-discounts.dto';
import { UpdateDiscountDto } from './dto/update-discount.dto';
import { UpdateStarDto } from './dto/update-star.dto';
import { Roles } from '@decorators/roles.decorator';
import { JwtAuthGuard } from '@guards/jwt-auth.guard';
import { RolesGuard } from '@guards/roles.guard';
import { User } from '@decorators/user.decorator';
import { JwtPayloadUser } from '@interfaces/payload-user.interface';

@ApiTags('descuentos')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('descuentos')
export class DiscountController {
  constructor(private readonly descuentosService: DiscountService) {}

  // Endpoints de gestión de códigos de descuento
  @Post('codigos')
  @ApiOperation({ summary: 'Crear un nuevo código de descuento' })
  @Roles(UserRoles.ADMIN, UserRoles.SUPER_ADMIN)
  @HttpCode(HttpStatus.CREATED)
  crearCodigoDescuento(@Query() dto: CreateDiscountDto) {
    return this.descuentosService.createDiscount(dto);
  }

  @Get('codigos')
  @ApiOperation({ summary: 'Listar todos los códigos de descuento' })
  @Roles(UserRoles.USER, UserRoles.ADMIN, UserRoles.SUPER_ADMIN)
  listarCodigosDescuento() {
    return this.descuentosService.getExistingCodes();
  }

  @Get('codigos/:id')
  @ApiOperation({ summary: 'Obtener código de descuento por ID' })
  @Roles(UserRoles.USER, UserRoles.ADMIN, UserRoles.SUPER_ADMIN)
  obtenerCodigoDescuento(@Query('code_id') codigoId: string) {
    return this.descuentosService.getDiscountCodeById(codigoId);
  }

  // Endpoints de descuentos de usuario
  @Get('usuarios')
  @ApiOperation({ summary: 'Listar descuentos de todos los usuarios' })
  @Roles(UserRoles.ADMIN, UserRoles.SUPER_ADMIN)
  listarDescuentosUsuarios(@Query() filtroDto: FilterUserDiscountsDto) {
    return this.descuentosService.getAllUserDiscounts(filtroDto);
  }

  @Get('usuarios/mi-cuenta')
  @ApiOperation({ summary: 'Obtener descuentos del usuario actual' })
  @Roles(UserRoles.USER, UserRoles.ADMIN, UserRoles.SUPER_ADMIN)
  obtenerMisDescuentos(
    @Query() filtroDto: FilterUserDiscountsDto,
    @User() usuario: JwtPayloadUser,
  ) {
    return this.descuentosService.getUserDiscounts(filtroDto, usuario.id);
  }

  @Get('usuarios/descuento/:id')
  @ApiOperation({ summary: 'Obtener descuento específico de usuario' })
  @Roles(UserRoles.USER, UserRoles.ADMIN, UserRoles.SUPER_ADMIN)
  obtenerDescuentoUsuario(@Query('discount_id') descuentoId: string) {
    return this.descuentosService.getUserDiscountById(descuentoId);
  }

  @Put('usuarios/descuento')
  @ApiOperation({ summary: 'Actualizar estado de descuento de usuario' })
  @Roles(UserRoles.USER, UserRoles.ADMIN, UserRoles.SUPER_ADMIN)
  actualizarDescuentoUsuario(
    @Query() dto: UpdateDiscountDto,
    @User() usuario: JwtPayloadUser,
  ) {
    return this.descuentosService.updateUserDiscount(dto, usuario.id);
  }

  @Delete('usuarios/descuento')
  @ApiOperation({ summary: 'Eliminar descuento de usuario' })
  @Roles(UserRoles.ADMIN, UserRoles.SUPER_ADMIN)
  eliminarDescuentoUsuario(
    @Query('discountId') descuentoId: string,
    @Query('userId') usuarioId: string,
  ) {
    return this.descuentosService.deleteDiscount(descuentoId, usuarioId);
  }

  // Endpoints de recompensas
  @Put('recompensas/estrellas')
  @ApiOperation({ summary: 'Actualizar estrellas de recompensa' })
  @Roles(UserRoles.USER, UserRoles.ADMIN, UserRoles.SUPER_ADMIN)
  actualizarEstrellas(
    @Query() dto: UpdateStarDto,
    @User() usuario: JwtPayloadUser,
  ) {
    return this.descuentosService.updateStars(dto, usuario.id);
  }

  @Get('recompensas/estrellas')
  @ApiOperation({ summary: 'Consultar estrellas acumuladas' })
  @Roles(UserRoles.USER, UserRoles.ADMIN, UserRoles.SUPER_ADMIN)
  consultarEstrellas(@User() usuario: JwtPayloadUser) {
    return this.descuentosService.getStars(usuario.id);
  }
}
