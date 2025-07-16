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

@ApiTags('Descuentos')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('discounts')
export class DiscountsController {
  constructor(private readonly discountService: DiscountService) {}

  @Post('codes')
  @Roles('admin', 'super_admin')
  @ApiOperation({ summary: 'Crear un nuevo código de descuento global' })
  @ApiResponse({ status: 201, description: 'Código creado correctamente' })
  @HttpCode(HttpStatus.CREATED)
  async createDiscountCode(
    @Body() dto: CreateDiscountCodeDto,
  ): Promise<{ data: string }> {
    const id = await this.discountService.createDiscountCode(dto);
    return { data: id };
  }

  @Post('create')
  @Roles('admin', 'super_admin')
  @ApiOperation({ summary: 'Crear nuevo descuento de usuario' })
  @ApiResponse({ status: 201, description: 'Descuento creado exitosamente' })
  @HttpCode(HttpStatus.CREATED)
  async createUserDiscount(@Body() dto: CreateUserDiscountDto): Promise<any> {
    return this.discountService.createUserDiscount(dto);
  }

  @Get('existing-codes')
  @Roles('user', 'admin', 'super_admin')
  @ApiOperation({ summary: 'Obtener todos los códigos de descuento globales' })
  @ApiResponse({ status: 200, description: 'Listado de códigos' })
  async getExistingCodes(): Promise<any> {
    return this.discountService.getAllDiscountCodes();
  }

  @Get('existing-codes/:id')
  @Roles('user', 'admin', 'super_admin')
  @ApiOperation({ summary: 'Obtener un código de descuento global por ID' })
  @ApiResponse({ status: 200, description: 'Código encontrado' })
  async getDiscountByCodeId(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<any> {
    return this.discountService.getDiscountByCodeId(id);
  }

  @Get('user-discounts')
  @Roles('admin', 'super_admin')
  @ApiOperation({
    summary: 'Obtener descuentos de todos los usuarios con filtro opcional',
  })
  @ApiResponse({
    status: 200,
    description: 'Listado de descuentos de usuarios',
  })
  async getAllUsersDiscounts(
    @Query() filterDto: FilterUserDiscountsDto,
  ): Promise<any> {
    return this.discountService.getAllUserDiscounts(filterDto);
  }

  @Get('user-discounts/me')
  @Roles('user', 'admin', 'super_admin')
  @ApiOperation({ summary: 'Obtener descuentos del usuario autenticado' })
  @ApiResponse({
    status: 200,
    description: 'Listado de descuentos del usuario',
  })
  async getDiscountsByUser(
    @Query() filterDto: FilterUserDiscountsDto,
    @User() user: UserEntity,
  ): Promise<any> {
    return this.discountService.getUserDiscounts(filterDto, user.id);
  }

  @Get('user-discounts/:id')
  @Roles('user', 'admin', 'super_admin')
  @ApiOperation({ summary: 'Obtener un descuento de usuario por su ID' })
  @ApiResponse({ status: 200, description: 'Descuento encontrado' })
  async getDiscountByDiscountId(
    @Param('id', ParseUUIDPipe) id: string,
    @User() user: UserEntity,
  ): Promise<any> {
    return this.discountService.getUserDiscountById(id, user.id);
  }

  @Put('user-discounts/:id')
  @Roles('user', 'admin', 'super_admin')
  @ApiOperation({ summary: 'Actualizar un descuento de usuario por ID' })
  @ApiResponse({ status: 200, description: 'Descuento actualizado' })
  async updateDiscount(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateUserDiscountDto,
    @User() user: UserEntity,
  ): Promise<any> {
    return this.discountService.updateUserDiscount(id, dto, user.id);
  }

  @Delete('user-discounts/:id')
  @Roles('admin', 'super_admin')
  @ApiOperation({ summary: 'Eliminar un descuento de usuario por ID' })
  @ApiResponse({ status: 200, description: 'Descuento eliminado' })
  async deleteDiscount(@Param('id', ParseUUIDPipe) id: string): Promise<any> {
    return this.discountService.deleteUserDiscount(id);
  }
}
