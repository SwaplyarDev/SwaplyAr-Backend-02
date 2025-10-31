import { RolesGuard } from '@common/guards/roles.guard';
import { JwtAuthGuard } from '@common/jwt-auth.guard';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse 
} from '@nestjs/swagger';
import { AdminDiscountService } from './admin-discount.service';
import { UserRole } from 'src/enum/user-role.enum';
import { Roles } from '@common/decorators/roles.decorator';
import { DiscountCode } from 'src/modules/discounts/entities/discount-code.entity';
import { CreateDiscountCodeDto } from './dto/create-discount-code.dto';
import { UserDiscount } from 'src/modules/discounts/entities/user-discount.entity';
import { FilterUserDiscountsDto } from './dto/filter-user-discounts.dto';
import { UserDiscountHistoryDto } from 'src/modules/discounts/dto/user-discount-history.dto';

interface DataResponse<T> {
  data: T;
}

@Controller('discounts')
@ApiTags('Descuentos (Admin)')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
export class AdminDiscountsController {
  constructor(private readonly adminDiscountService: AdminDiscountService) {}

  /**
   * Crea un código de descuento global, un descuento de usuario sin usar y sin fecha y devuelve el código completo.
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
    const userId = dto.userId; 
    const code = await this.adminDiscountService.createDiscountCode(dto, dto.userId);
    return { data: code };
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
    
      */

  @Get('user-discounts')
  @Roles(UserRole.Admin, UserRole.SuperAdmin)
  @ApiOperation({
    summary: 'Obtener descuentos de todos los usuarios con filtro opcional',
  })
  @ApiOkResponse({
    description: 'Listado de descuentos de usuarios',
    type: [UserDiscount],
  })
  @ApiUnauthorizedResponse({ description: 'No autenticado' })
  @ApiForbiddenResponse({ description: 'No autorizado' })
  @HttpCode(HttpStatus.OK)
  async getAllUserDiscounts(
    @Query() filterDto: FilterUserDiscountsDto,
  ): Promise<DataResponse<UserDiscount[]>> {
    const discounts = await this.adminDiscountService.getAllUserDiscounts(filterDto);
    return { data: discounts };
  }

  @Get('user-history/admin/:userId')
  @Roles(UserRole.Admin, UserRole.SuperAdmin)
  @ApiOperation({
    summary: 'Obtener historial de cupones de un usuario específico (Admin)',
  })
  @ApiOkResponse({
    description: 'Historial de descuentos del usuario',
    type: [UserDiscountHistoryDto],
  })
  @HttpCode(HttpStatus.OK)
  async getUserDiscountHistoryByAdmin(
    @Param('userId') userId: string,
  ): Promise<DataResponse<UserDiscountHistoryDto[]>> {
    const history = await this.adminDiscountService.getUserDiscountHistoryByAdmin(userId);
    return { data: history };
  }
}
