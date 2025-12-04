import {
  Controller,
  Get,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiOkResponse,
  ApiUnauthorizedResponse,
  ApiBadRequestResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { DiscountService } from './discounts.service';
import { UpdateUserDiscountDto } from './dto/update-user-discount.dto';
import { JwtAuthGuard } from '@common/jwt-auth.guard';
import { RolesGuard } from '@common/guards/roles.guard';
import { Roles } from '@common/decorators/roles.decorator';
import { User } from '@common/user.decorator';
import { User as UserEntity } from '@users/entities/user.entity';
import { UserDiscountHistoryDto } from './dto/user-discount-history.dto';
import { UserDiscount } from './entities/user-discount.entity';
import { UserDiscountsFromUserDto } from './dto/get-discounts-from-user-response.dto';
import { StarsFromUserDto } from './dto/get-stars-from-user-response.dto';

interface DataResponse<T> {
  data: T;
}

@Controller('discounts')
@ApiTags('Descuentos')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
export class DiscountsController {
  constructor(private readonly discountService: DiscountService) {}

  @Get('user-discounts/available/me')
  @Roles('user', 'admin', 'super_admin')
  @ApiOperation({
    summary: 'Obtener descuentos disponibles del usuario autenticado',
    description:
      'Este endpoint devuelve únicamente los descuentos activos y no utilizados (isUsed = false) del usuario autenticado. El parámetro filterType fue eliminado.',
  })
  @ApiOkResponse({
    description: 'Listado de descuentos disponibles del usuario',
    type: UserDiscountsFromUserDto,
  })
  @ApiUnauthorizedResponse({ description: 'No autenticado' })
  @HttpCode(HttpStatus.OK)
  async getmyAvailableUserDiscounts(
    @User() user: UserEntity,
  ): Promise<DataResponse<UserDiscount[]>> {
    const discounts = await this.discountService.getAvailableUserDiscounts(user.id);
    return { data: discounts };
  }

  @Get('user-history')
  @Roles('user', 'admin', 'super_admin')
  @ApiOperation({ summary: 'Obtener historial de cupones usados del usuario autenticado' })
  @ApiOkResponse({
    description: 'Listado del historial de cupones usados',
    type: [UserDiscountHistoryDto],
  })
  @ApiUnauthorizedResponse({ description: 'No autenticado' })
  @HttpCode(HttpStatus.OK)
  async getMyDiscountHistory(
    @User() user: UserEntity,
  ): Promise<DataResponse<UserDiscountHistoryDto[]>> {
    const history = await this.discountService.getUserDiscountHistory(user.id);
    return { data: history };
  }

  @Put('user-discounts/admin/:id')
  @Roles('admin', 'super_admin')
  @ApiOperation({ summary: 'Actualizar un descuento de usuario por ID' })
  @ApiOkResponse({ description: 'Descuento actualizado' })
  @ApiNotFoundResponse({ description: 'Descuento no encontrado' })
  @ApiBadRequestResponse({ description: 'Parámetro inválido' })
  @ApiUnauthorizedResponse({ description: 'No autenticado' })
  @ApiForbiddenResponse({ description: 'No autorizado' })
  @HttpCode(HttpStatus.OK)
  async updateUserDiscount(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateUserDiscountDto,
    @User() user: UserEntity,
  ): Promise<DataResponse<void>> {
    await this.discountService.updateUserDiscount(id, dto, user.id);
    return { data: undefined };
  }

  @Delete('user-discounts/admin/:id')
  @Roles('admin', 'super_admin')
  @ApiOperation({ summary: 'Eliminar un descuento de usuario por ID' })
  @ApiOkResponse({ description: 'Descuento eliminado' })
  @ApiNotFoundResponse({ description: 'Descuento no encontrado' })
  @ApiUnauthorizedResponse({ description: 'No autenticado' })
  @ApiForbiddenResponse({ description: 'No autorizado' })
  @HttpCode(HttpStatus.OK)
  async deleteUserDiscount(@Param('id', ParseUUIDPipe) id: string): Promise<DataResponse<void>> {
    await this.discountService.deleteUserDiscount(id);
    return { data: undefined };
  }

  @Get('stars')
  @Roles('user', 'admin', 'super_admin')
  @ApiOperation({
    summary: 'Obtener recompensas del usuario (cantidad y estrellas)',
  })
  @ApiOkResponse({
    description: 'Datos de recompensa',
    type: StarsFromUserDto,
  })
  @ApiUnauthorizedResponse({ description: 'No autenticado' })
  @ApiForbiddenResponse({ description: 'No autorizado' })
  @HttpCode(HttpStatus.OK)
  async getStars(
    @User() user: UserEntity,
  ): Promise<DataResponse<{ quantity: number; stars: number }>> {
    const stars = await this.discountService.getStars(user.id);
    return { data: stars };
  }

  @Get('stars/:userId')
  @Roles('admin', 'super_admin')
  @ApiOperation({
    summary: 'Obtener recompensas del usuario (cantidad y estrellas) por ID de usuario',
  })
  @ApiOkResponse({
    description: 'Datos de recompensa',
    type: StarsFromUserDto,
  })
  @ApiNotFoundResponse({ description: 'Usuario no encontrado' })
  @ApiUnauthorizedResponse({ description: 'No autenticado' })
  @ApiForbiddenResponse({ description: 'No autorizado' })
  @HttpCode(HttpStatus.OK)
  async getStarsByUserId(
    @Param('userId', ParseUUIDPipe) userId: string,
  ): Promise<DataResponse<{ quantity: number; stars: number }>> {
    const stars = await this.discountService.getStars(userId);
    return { data: stars };
  }
}
