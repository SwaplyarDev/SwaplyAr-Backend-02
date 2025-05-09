import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PaymentMethodService } from './payment-method.service';
import { CreatePaymentMethodDto } from './dto/create-payment-method.dto';
import { UpdatePaymentMethodDto } from './dto/update-payment-method.dto';

@Controller('payment-method')
export class PaymentMethodController {
  constructor(private readonly paymentMethodService: PaymentMethodService) {}

  @Post()
  async create(@Body() createPaymentMethodDto: CreatePaymentMethodDto) {
    return await this.paymentMethodService.create(createPaymentMethodDto);
  }

  @Get()
  async findAll() {
    return await this.paymentMethodService.findAllFinancialAccounts();
  }


  @Get("/bank")
  async findAllBank() {
    return await this.paymentMethodService.findAllBank();
  }
  @Get("/pix")
  async findAllPix() {
    return await this.paymentMethodService.findAllPix();
  }

}
