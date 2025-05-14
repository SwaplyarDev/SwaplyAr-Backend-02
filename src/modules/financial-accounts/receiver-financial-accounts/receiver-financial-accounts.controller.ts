import { Body, Controller, Get, Post } from '@nestjs/common';
import { ReceiverFinancialAccountsService } from './receiver-financial-accounts.service';
import { CreateReceiverFinancialAccountDto } from './dto/create-receiver-financial-account.dto';

@Controller('receiver-financial-accounts')
export class ReceiverFinancialAccountsController {
  constructor(
    private readonly ReceiverFinancialAccountsService: ReceiverFinancialAccountsService,
  ) {}

  @Post()
  create(
    @Body()
    createReceiverFinancialAccountDto: CreateReceiverFinancialAccountDto,
  ) {
    return this.ReceiverFinancialAccountsService.create(
      createReceiverFinancialAccountDto,
    );
  }

  @Get()
  findAll() {
    return this.ReceiverFinancialAccountsService.findAll();
  }
}
