import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ReceiverFinancialAccountsService } from './receiver-financial-accounts.service';
import { CreateReceiverFinancialAccountDto } from './dto/create-receiver-financial-account.dto';
import { UpdateReceiverFinancialAccountDto } from './dto/update-receiver-financial-account.dto';

@Controller('receiver-financial-accounts')
export class ReceiverFinancialAccountsController {
  constructor(private readonly ReceiverFinancialAccountsService: ReceiverFinancialAccountsService) {}

  @Post()
  create(@Body() createReceiverFinancialAccountDto: CreateReceiverFinancialAccountDto) {
    return this.ReceiverFinancialAccountsService.create(createReceiverFinancialAccountDto);
  }

  @Get()
  findAll() {
    return this.ReceiverFinancialAccountsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ReceiverFinancialAccountsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateReceiverFinancialAccountDto: UpdateReceiverFinancialAccountDto) {
    return this.ReceiverFinancialAccountsService.update(+id, updateReceiverFinancialAccountDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ReceiverFinancialAccountsService.remove(+id);
  }
}
