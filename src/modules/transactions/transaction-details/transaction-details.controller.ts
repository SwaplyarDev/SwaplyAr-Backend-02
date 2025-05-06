import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TransactionDetailsService } from './transaction-details.service';
import { CreateTransactionDetailDto } from './dto/create-transaction-detail.dto';
import { UpdateTransactionDetailDto } from './dto/update-transaction-detail.dto';

@Controller('transaction-details')
export class TransactionDetailsController {
  constructor(private readonly transactionDetailsService: TransactionDetailsService) {}

  @Post()
  create(@Body() createTransactionDetailDto: CreateTransactionDetailDto) {
    return this.transactionDetailsService.create(createTransactionDetailDto);
  }

  @Get()
  findAll() {
    return this.transactionDetailsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.transactionDetailsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTransactionDetailDto: UpdateTransactionDetailDto) {
    return this.transactionDetailsService.update(+id, updateTransactionDetailDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.transactionDetailsService.remove(+id);
  }
}
