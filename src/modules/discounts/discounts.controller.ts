import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Query,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiOkResponse,
} from '@nestjs/swagger';
import { DiscountService } from './discounts.service';
import { CreateUserDiscountDto } from './dto/create-user-discount.dto';
import { FilterUserDiscountsDto } from './dto/filter-user-discounts.dto';
import { UpdateUserDiscountDto } from './dto/update-user-discount.dto';
import { JwtAuthGuard } from '@common/jwt-auth.guard';
import { RolesGuard } from '@common/guards/roles.guard';
import { Roles } from '@common/decorators/roles.decorator';
import { User } from '@common/user.decorator';
import { User as UserEntity } from '@users/entities/user.entity';
import { CreateDiscountCodeDto } from '@discounts/dto/create-discount-code.dto';
import { UpdateStarDto } from '@discounts/dto/update-star.dto';
import { DiscountCode } from '@users/entities/discount-code.entity';
import { UserDiscount } from '@users/entities/user-discount.entity';
import { UserRewardsLedger } from '@users/entities/user-rewards-ledger.entity';

const ADMIN_ROLES = ['admin', 'super_admin'] as const;
const ALL_USER_ROLES = ['user', 'admin', 'super_admin'] as const;

interface DataResponse<T> {
  data: T;
}

@Controller('discounts')
@ApiTags('discounts')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
export class DiscountsController {
  constructor(private readonly discountService: DiscountService) {}

  @Post('codes')
  @Roles(...ADMIN_ROLES)
  @ApiOperation({ summary: 'Crear un nuevo código de descuento global' })
  @ApiResponse({
    status: 201,
    description: 'Código creado correctamente',
    type: DiscountCode,
  })
  @ApiResponse({ status: 400, description: 'Parámetros inválidos' })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  @ApiResponse({ status: 403, description: 'No autorizado' })
  @HttpCode(HttpStatus.CREATED)
  async createDiscountCode(
    @Body() dto: CreateDiscountCodeDto,
  ): Promise<DataResponse<DiscountCode>> {
    const code = await this.discountService.createDiscountCode(dto);
    return { data: code };
  }

  @Post('user-discounts')
  @Roles(...ADMIN_ROLES)
  @ApiOperation({ summary: 'Crear nuevo descuento de usuario' })
  @ApiResponse({
    status: 201,
    description: 'Descuento creado exitosamente',
    type: UserDiscount,
  })
  @ApiResponse({ status: 400, description: 'Parámetros inválidos' })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  @ApiResponse({ status: 403, description: 'No autorizado' })
  @HttpCode(HttpStatus.CREATED)
  async createUserDiscountForUser(
    @Body() dto: CreateUserDiscountDto,
  ): Promise<DataResponse<UserDiscount>> {
    const discount = await this.discountService.createUserDiscount(dto);
    return { data: discount };
  }

  @Get('existing-codes')
  @Roles(...ALL_USER_ROLES)
  @ApiOperation({ summary: 'Obtener todos los códigos de descuento globales' })
  @ApiResponse({
    status: 200,
    description: 'Listado de códigos',
    type: [DiscountCode],
  })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  @ApiResponse({ status: 403, description: 'No autorizado' })
  @HttpCode(HttpStatus.OK)
  async getAllDiscountCodes(): Promise<DataResponse<DiscountCode[]>> {
    const codes = await this.discountService.getAllDiscountCodes();
    return { data: codes };
  }

  @Get('existing-codes/:id')
  @Roles(...ALL_USER_ROLES)
  @ApiOperation({ summary: 'Obtener un código de descuento global por ID' })
  @ApiResponse({
    status: 200,
    description: 'Código encontrado',
    type: DiscountCode,
  })
  @ApiResponse({ status: 404, description: 'Código no encontrado' })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  @ApiResponse({ status: 403, description: 'No autorizado' })
  @HttpCode(HttpStatus.OK)
  async getDiscountCodeById(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<DataResponse<DiscountCode>> {
    const code = await this.discountService.getDiscountByCodeId(id);
    return { data: code };
  }

  @Get('user-discounts')
  @Roles(...ADMIN_ROLES)
  @ApiOperation({
    summary: 'Obtener descuentos de todos los usuarios con filtro opcional',
  })
  @ApiResponse({
    status: 200,
    description: 'Listado de descuentos de usuarios',
    type: [UserDiscount],
  })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  @ApiResponse({ status: 403, description: 'No autorizado' })
  @HttpCode(HttpStatus.OK)
  async getAllUserDiscounts(
    @Query() filterDto: FilterUserDiscountsDto,
  ): Promise<DataResponse<UserDiscount[]>> {
    const discounts = await this.discountService.getAllUserDiscounts(filterDto);
    return { data: discounts };
  }

  @Get('user-discounts/me')
  @Roles(...ALL_USER_ROLES)
  @ApiOperation({ summary: 'Obtener descuentos del usuario autenticado' })
  @ApiResponse({
    status: 200,
    description: 'Listado de descuentos del usuario',
    type: [UserDiscount],
  })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  @HttpCode(HttpStatus.OK)
  async getMyUserDiscounts(
    @Query() filterDto: FilterUserDiscountsDto,
    @User() user: UserEntity,
  ): Promise<DataResponse<UserDiscount[]>> {
    const discounts = await this.discountService.getUserDiscounts(
      filterDto,
      user.id,
    );
    return { data: discounts };
  }

  @Get('user-discounts/:id')
  @Roles(...ALL_USER_ROLES)
  @ApiOperation({ summary: 'Obtener un descuento de usuario por su ID' })
  @ApiResponse({
    status: 200,
    description: 'Descuento encontrado',
    type: UserDiscount,
  })
  @ApiResponse({ status: 404, description: 'Descuento no encontrado' })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  @ApiResponse({ status: 403, description: 'No autorizado' })
  @HttpCode(HttpStatus.OK)
  async getUserDiscountById(
    @Param('id', ParseUUIDPipe) id: string,
    @User() user: UserEntity,
  ): Promise<DataResponse<UserDiscount>> {
    const discount = await this.discountService.getUserDiscountById(
      id,
      user.id,
    );
    return { data: discount };
  }

  @Put('user-discounts/:id')
  @Roles(...ALL_USER_ROLES)
  @ApiOperation({ summary: 'Actualizar un descuento de usuario por ID' })
  @ApiResponse({ status: 200, description: 'Descuento actualizado' })
  @ApiResponse({ status: 404, description: 'Descuento no encontrado' })
  @ApiResponse({ status: 400, description: 'Parámetro inválido' })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  @ApiResponse({ status: 403, description: 'No autorizado' })
  @HttpCode(HttpStatus.OK)
  async updateUserDiscount(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateUserDiscountDto,
    @User() user: UserEntity,
  ): Promise<DataResponse<void>> {
    await this.discountService.updateUserDiscount(id, dto, user.id);
    return { data: undefined };
  }

  @Delete('user-discounts/:id')
  @Roles(...ADMIN_ROLES)
  @ApiOperation({ summary: 'Eliminar un descuento de usuario por ID' })
  @ApiResponse({ status: 200, description: 'Descuento eliminado' })
  @ApiResponse({ status: 404, description: 'Descuento no encontrado' })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  @ApiResponse({ status: 403, description: 'No autorizado' })
  @HttpCode(HttpStatus.OK)
  async deleteUserDiscount(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<DataResponse<void>> {
    await this.discountService.deleteUserDiscount(id);
    return { data: undefined };
  }

  /*
   *  RECOMPENSAS
   */
  @Put('update-star')
  @Roles(...ADMIN_ROLES)
  @ApiOperation({ summary: 'Actualizar recompensas de usuario (estrellas)' })
  @ApiOkResponse({
    description:
      'Recompensa actualizada, devuelve true si se completó un ciclo',
    schema: {
      example: {
        data: {
          cycleCompleted: true,
          ledger: {
            /* estructura del ledger */
          },
          message: 'Has completado un ciclo',
        },
      },
      properties: {
        data: {
          type: 'object',
          properties: {
            cycleCompleted: { type: 'boolean' },
            ledger: { type: 'object' },
            message: { type: 'string' },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  @ApiResponse({ status: 403, description: 'No autorizado' })
  @HttpCode(HttpStatus.OK)
  async updateStar(
    @Body() dto: UpdateStarDto,
    @User() user: UserEntity,
  ): Promise<
    DataResponse<{
      cycleCompleted: boolean;
      ledger: UserRewardsLedger;
      message?: string;
    }>
  > {
    const result = await this.discountService.updateStars(dto, user.id);
    return { data: result };
  }

  @Get('stars')
  @Roles(...ALL_USER_ROLES)
  @ApiOperation({
    summary: 'Obtener recompensas del usuario (cantidad y estrellas)',
  })
  @ApiOkResponse({
    description: 'Datos de recompensa',
    schema: {
      example: { data: { quantity: 500, stars: 2 } },
      properties: {
        data: {
          type: 'object',
          properties: {
            quantity: { type: 'number' },
            stars: { type: 'number' },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  @ApiResponse({ status: 403, description: 'No autorizado' })
  @HttpCode(HttpStatus.OK)
  async getStars(
    @User() user: UserEntity,
  ): Promise<DataResponse<{ quantity: number; stars: number }>> {
    const stars = await this.discountService.getStars(user.id);
    return { data: stars };
  }

  @Get('stars/:userId')
  @Roles(...ADMIN_ROLES)
  @ApiOperation({
    summary:
      'Obtener recompensas del usuario (cantidad y estrellas) por ID de usuario',
  })
  @ApiOkResponse({
    description: 'Datos de recompensa',
    schema: {
      example: { data: { quantity: 500, stars: 2 } },
      properties: {
        data: {
          type: 'object',
          properties: {
            quantity: { type: 'number' },
            stars: { type: 'number' },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  @ApiResponse({ status: 403, description: 'No autorizado' })
  @HttpCode(HttpStatus.OK)
  async getStarsByUserId(
    @Param('userId', ParseUUIDPipe) userId: string,
  ): Promise<DataResponse<{ quantity: number; stars: number }>> {
    const stars = await this.discountService.getStars(userId);
    return { data: stars };
  }
}
