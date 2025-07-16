import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Body, Controller, Post, BadRequestException } from '@nestjs/common';
// import { Discount_code } from '@users/entities/user.entity';
import {CreateDiscountDto} from "./dto/create-discount.dto";
import { DiscountsService } from './discounts.service';

@ApiTags('Descuentos')
@Controller('discounts')
export class DiscountsController {
  constructor(
    private readonly discountsService: DiscountsService
  ) {}

  // @Post('create')
  // @ApiOperation({ summary: 'Crear nuevo descuento' })
  // @ApiResponse({ status: 201, description: 'Descuento creado exitosamente' })
  // @ApiResponse({ status: 400, description: 'Datos inválidos' })
  // async createDiscount(@Body() discountDto: CreateDiscountDto): Promise<Discount> {
  //   try {
  //     return await this.discountsService.createDiscount(discountDto);
  //   } catch (error) {
  //     throw new BadRequestException('Error al crear el descuento');
  //   }
  // }
}