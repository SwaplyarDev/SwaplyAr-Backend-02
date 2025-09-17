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
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiOkResponse } from '@nestjs/swagger';
import { DiscountService } from '../services/discounts.service';
import { CreateUserDiscountDto } from '../dto/create-user-discount.dto';
import { FilterUserDiscountsDto } from '../dto/filter-user-discounts.dto';
import { UpdateUserDiscountDto } from '../dto/update-user-discount.dto';
import { JwtAuthGuard } from '@common/jwt-auth.guard';
import { RolesGuard } from '@common/guards/roles.guard';
import { Roles } from '@common/decorators/roles.decorator';
import { User } from '@common/user.decorator';
import { User as UserEntity } from '@users/entities/user.entity';
import { CreateDiscountCodeDto } from 'src/discounts/dto/create-discount-code.dto';
import { UpdateStarDto } from 'src/discounts/dto/update-star.dto';
import { DiscountCode } from '@users/entities/discount-code.entity';
import { UserDiscount } from '@discounts/entities/user-discount.entity';
import { UserRewardsLedger } from '@discounts/entities/user-rewards-ledger.entity';
import { UserRole } from 'src/enum/user-role.enum';
import { UserDiscountHistoryDto } from '../dto/user-discount-history.dto';

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
  @Roles(UserRole.Admin, UserRole.SuperAdmin)
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
  @Roles(UserRole.Admin, UserRole.SuperAdmin)
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
  @Roles(UserRole.User, UserRole.Admin, UserRole.SuperAdmin)
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
  @Roles(UserRole.User, UserRole.Admin, UserRole.SuperAdmin)
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
  @Roles(UserRole.Admin, UserRole.SuperAdmin)
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
  @Roles(UserRole.User, UserRole.Admin, UserRole.SuperAdmin)
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
    const discounts = await this.discountService.getUserDiscounts(filterDto, user.id);
    return { data: discounts };
  }

  //AGREGADO PARA LA TAREA.
  @Get ('user-history')
  @Roles (UserRole.User, UserRole.Admin, UserRole.SuperAdmin)

  @ApiOperation ({ summary: 'Obtener historial de cupones usados del usuario autenticado' })

  @ApiResponse ({

  status: 200,
  description: 'Listado del historial de cupones usados',
  type: [UserDiscountHistoryDto],

  })

  @ApiResponse ({ status: 401, description: 'No autenticado' })
  @HttpCode (HttpStatus.OK)
  async getMyDiscountHistory (@User () user: UserEntity): Promise<DataResponse<UserDiscountHistoryDto[]>> {

  const history = await this.discountService.getUserDiscountHistory (user.id);
  return { data: history };

  }

  @Get ('user-history/:userId')
  @Roles (UserRole.Admin, UserRole.SuperAdmin)

  @ApiOperation ({

    summary: 'Obtener historial de cupones de un usuario específico (Admin)',

  })

  @ApiResponse ({

    status: 200,
    description: 'Historial de descuentos del usuario',
    type: [UserDiscountHistoryDto],

  })

  @HttpCode (HttpStatus.OK)

  async getUserDiscountHistoryByAdmin (

    @Param('userId') userId: string,

  ): Promise<DataResponse<UserDiscountHistoryDto []>> {

    const history = await this.discountService.getUserDiscountHistoryByAdmin (userId);
    return { data: history };

  }
  
  @Get('user-discounts/:id')
  @Roles(UserRole.Admin, UserRole.SuperAdmin)
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
  ): Promise<DataResponse<UserDiscount[]>> {
    const discount = await this.discountService.getUserDiscountsByUserId(
      id,
      user.role, // <-- rol de admin, super-admin aquí
    );
    return { data: discount };
  }

  @Put('user-discounts/:id')
  @Roles(UserRole.User, UserRole.Admin, UserRole.SuperAdmin)
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
  @Roles(UserRole.Admin, UserRole.SuperAdmin)
  @ApiOperation({ summary: 'Eliminar un descuento de usuario por ID' })
  @ApiResponse({ status: 200, description: 'Descuento eliminado' })
  @ApiResponse({ status: 404, description: 'Descuento no encontrado' })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  @ApiResponse({ status: 403, description: 'No autorizado' })
  @HttpCode(HttpStatus.OK)
  async deleteUserDiscount(@Param('id', ParseUUIDPipe) id: string): Promise<DataResponse<void>> {
    await this.discountService.deleteUserDiscount(id);
    return { data: undefined };
  }

  /*
   *  RECOMPENSAS
   */
  @Put('update-star')
  @Roles(UserRole.Admin, UserRole.SuperAdmin)
  @ApiOperation({ summary: 'Actualizar recompensas de usuario (estrellas)' })
  @ApiOkResponse({
    description: 'Recompensa actualizada, devuelve true si se completó un ciclo',
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
  @Roles(UserRole.User, UserRole.Admin, UserRole.SuperAdmin)
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
  @Roles(UserRole.Admin, UserRole.SuperAdmin)
  @ApiOperation({
    summary: 'Obtener recompensas del usuario (cantidad y estrellas) por ID de usuario',
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
