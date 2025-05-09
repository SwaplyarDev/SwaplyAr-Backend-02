
import { Body, Controller, Get, Post } from '@nestjs/common';
import { FinancialAccountsService } from './financial-accounts.service';
import { CreateFinancialAccountDto } from './dto/create-financial-accounts.dto';

@Controller('financial-accounts')
export class FinancialAccountController {
  constructor(private readonly financialAccountsService:FinancialAccountsService) {}

  @Post()
  async create(@Body() createFinancialAccountDto: CreateFinancialAccountDto) {
    return this.financialAccountsService.create(createFinancialAccountDto);
  }

  @Get("/sender")
    async findAllSender() {
        return await this.financialAccountsService.findAllSender();
    }


}