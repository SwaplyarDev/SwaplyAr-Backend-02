import { Body, Controller, Get, Post } from '@nestjs/common';
import { PaymentMethodService } from './payment-method.service';
import { CreatePaymentMethodDto } from './dto/create-payment-method.dto';

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

  @Get('/bank')
  @Get('/bank')
  async findAllBank() {
    return await this.paymentMethodService.findAllBank();
  }

  @Get('/pix')
  async findAllPix() {
    return await this.paymentMethodService.findAllPix();
  }
}
