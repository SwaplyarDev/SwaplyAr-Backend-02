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
  @ApiResponse({ status: 201, description: 'Código creado correctamente' })
  @HttpCode(HttpStatus.CREATED)
  async createDiscountCode(
    @Body() dto: CreateDiscountCodeDto,
  ): Promise<DataResponse<string>> {
    const id = await this.discountService.createDiscountCode(dto);
    return { data: id };
  }

  @Post('create')
  @Roles(...ADMIN_ROLES)
  @ApiOperation({ summary: 'Crear nuevo descuento de usuario' })
  @ApiResponse({ status: 201, description: 'Descuento creado exitosamente' })
  @HttpCode(HttpStatus.CREATED)
  async createUserDiscountForUser(
    @Body() dto: CreateUserDiscountDto,
  ): Promise<DataResponse<string>> {
    const id = await this.discountService.createUserDiscount(dto);
    return { data: id };
  }

  @Get('existing-codes')
  @Roles(...ALL_USER_ROLES)
  @ApiOperation({ summary: 'Obtener todos los códigos de descuento globales' })
  @ApiResponse({ status: 200, description: 'Listado de códigos' })
  async getAllDiscountCodes(): Promise<DataResponse<any[]>> {
    const codes = await this.discountService.getAllDiscountCodes();
    return { data: codes };
  }

  @Get('existing-codes/:id')
  @Roles(...ALL_USER_ROLES)
  @ApiOperation({ summary: 'Obtener un código de descuento global por ID' })
  @ApiResponse({ status: 200, description: 'Código encontrado' })
  async getDiscountCodeById(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<DataResponse<any>> {
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
  })
  async getAllUserDiscounts(
    @Query() filterDto: FilterUserDiscountsDto,
  ): Promise<DataResponse<any[]>> {
    const discounts = await this.discountService.getAllUserDiscounts(filterDto);
    return { data: discounts };
  }

  @Get('user-discounts/me')
  @Roles(...ALL_USER_ROLES)
  @ApiOperation({ summary: 'Obtener descuentos del usuario autenticado' })
  @ApiResponse({
    status: 200,
    description: 'Listado de descuentos del usuario',
  })
  async getMyUserDiscounts(
    @Query() filterDto: FilterUserDiscountsDto,
    @User() user: UserEntity,
  ): Promise<DataResponse<any[]>> {
    const discounts = await this.discountService.getUserDiscounts(
      filterDto,
      user.id,
    );
    return { data: discounts };
  }

  @Get('user-discounts/:id')
  @Roles(...ALL_USER_ROLES)
  @ApiOperation({ summary: 'Obtener un descuento de usuario por su ID' })
  @ApiResponse({ status: 200, description: 'Descuento encontrado' })
  async getUserDiscountById(
    @Param('id', ParseUUIDPipe) id: string,
    @User() user: UserEntity,
  ): Promise<DataResponse<any>> {
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
  @Roles('user', 'admin', 'super_admin')
  @ApiOperation({ summary: 'Actualizar recompensas de usuario (estrellas)' })
  @ApiResponse({
    status: 200,
    description:
      'Recompensa actualizada, devuelve true si se completó un ciclo',
  })
  async updateStar(
    @Body() dto: UpdateStarDto,
    @User() user: UserEntity,
  ): Promise<{
    data: { cycleCompleted: boolean; quantity: number; stars: number };
  }> {
    const result = await this.discountService.updateStars(dto, user.id);
    return { data: result };
  }

  @Get('stars')
  @Roles('user', 'admin', 'super_admin')
  @ApiOperation({
    summary: 'Obtener recompensas del usuario (cantidad y estrellas)',
  })
  @ApiResponse({
    status: 200,
    description: 'Datos de recompensa',
    schema: {
      example: { data: { quantity: 500, stars: 2 } },
    },
  })
  async getStars(
    @User() user: UserEntity,
  ): Promise<{ quantity: number; stars: number }> {
    return this.discountService.getStars(user.id);
  }
}
