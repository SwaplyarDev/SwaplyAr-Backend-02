import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SenderFinancialAccountsService } from './sender-financial-accounts.service';
import { CreateSenderFinancialAccountDto } from './dto/create-sender-financial-account.dto';
import { UpdateSenderFinancialAccountDto } from './dto/update-sender-financial-account.dto';

@Controller('sender-financial-accounts')
export class SenderFinancialAccountsController {
  constructor(private readonly senderFinancialAccountsService: SenderFinancialAccountsService) {}

  @Post()
  create(@Body() createSenderFinancialAccountDto: CreateSenderFinancialAccountDto) {
    return this.senderFinancialAccountsService.create(createSenderFinancialAccountDto);
  }

  @Get()
  findAll() {
    return this.senderFinancialAccountsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.senderFinancialAccountsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSenderFinancialAccountDto: UpdateSenderFinancialAccountDto) {
    return this.senderFinancialAccountsService.update(+id, updateSenderFinancialAccountDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.senderFinancialAccountsService.remove(+id);
  }
}
