import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PaymentAccountsService } from './payment-accounts.service';
import { CreatePaymentAccountDto } from './dto/create-payment-account.dto';
import { UpdatePaymentAccountDto } from './dto/update-payment-account.dto';

@Controller('payment-accounts')
export class PaymentAccountsController {
  constructor(private readonly paymentAccountsService: PaymentAccountsService) {}

  @Post()
  create(@Body() createPaymentAccountDto: CreatePaymentAccountDto) {
    return this.paymentAccountsService.create(createPaymentAccountDto);
  }

  @Get()
  findAll() {
    return this.paymentAccountsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.paymentAccountsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePaymentAccountDto: UpdatePaymentAccountDto) {
    return this.paymentAccountsService.update(+id, updatePaymentAccountDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.paymentAccountsService.remove(+id);
  }
}
