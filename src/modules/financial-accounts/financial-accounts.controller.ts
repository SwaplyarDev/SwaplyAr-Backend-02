
import { Body, Controller, Get, Post } from '@nestjs/common';
import { FinancialAccountsService } from './financial-accounts.service';

@Controller('financial-accounts')
export class FinancialAccountController {
  constructor(private readonly financialAccountsService:FinancialAccountsService) {}

  @Post("create")
  async create(@Body() createFinancialAccountDto:any) {
    return this.financialAccountsService.create(createFinancialAccountDto);
  }
  @Get()
    findAll() {
        return "todos";
    }

}