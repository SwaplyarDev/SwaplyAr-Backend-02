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
  Req,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiOkResponse } from '@nestjs/swagger';
import { DiscountService } from './discounts.service';
import { CreateUserDiscountDto } from './dto/create-user-discount.dto';
import { FilterUserDiscountsDto } from '../admin/discounts/dto/filter-user-discounts.dto';
import { UpdateUserDiscountDto } from './dto/update-user-discount.dto';
import { JwtAuthGuard } from '@common/jwt-auth.guard';
import { RolesGuard } from '@common/guards/roles.guard';
import { Roles } from '@common/decorators/roles.decorator';
import { User } from '@common/user.decorator';
import { User as UserEntity } from '@users/entities/user.entity';
import { UserRole } from 'src/enum/user-role.enum';
import { UserDiscountHistoryDto } from './dto/user-discount-history.dto';
import { DiscountCode } from './entities/discount-code.entity';
import { CreateDiscountCodeDto } from '../admin/discounts/dto/create-discount-code.dto';
import { UserDiscount } from './entities/user-discount.entity';
import { UpdateStarDto } from './dto/update-star.dto';
import { UserRewardsLedger } from './entities/user-rewards-ledger.entity';

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
  @Roles(UserRole.User, UserRole.Admin, UserRole.SuperAdmin)
  @ApiOperation({
  summary: 'Obtener descuentos disponibles del usuario autenticado',
  description:
    'Este endpoint devuelve únicamente los descuentos activos y no utilizados (isUsed = false) del usuario autenticado. El parámetro filterType fue eliminado.',
  })
  @ApiResponse({
    status: 200,
    description: 'Listado de descuentos disponibles del usuario',
    schema: {
      example: {
        data: [
          {
            id: '38ed61fd-24c1-40c2-8ccd-c1f4458f3037',
            discountCode: {
              id: '1a9dad84-1f94-4355-bd4c-2c8b1ef2bdd1',
              code: 'WELCOME-TT8U49',
              value: 3,
              currencyCode: 'USD',
              validFrom: '2025-09-17T16:36:50.529Z',
              createdAt: '2025-09-17T16:36:50.534Z',
            },
            isUsed: false,
            createdAt: '2025-09-17T16:36:50.570Z',
            usedAt: null,
            updatedAt: '2025-09-26T16:56:49.573Z',
          },
        ],
      },
    },
  })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  @HttpCode(HttpStatus.OK)
  async getmyAvailableUserDiscounts (
    @User() user: UserEntity,
  ): Promise<DataResponse<UserDiscount[]>> {
    const discounts = await this.discountService.getAvailableUserDiscounts(user.id);
    return { data: discounts };
  }

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
  async getMyDiscountHistory (@User () user: UserEntity): Promise<DataResponse<UserDiscountHistoryDto []>> {

    const history = await this.discountService.getUserDiscountHistory (user.id);
    return { data: history };

  }
  
  

  @Put('user-discounts/admin/:id')
  @Roles(UserRole.Admin, UserRole.SuperAdmin)
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

  @Delete('user-discounts/admin/:id')
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
