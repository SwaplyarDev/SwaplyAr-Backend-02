import { Body, Controller, Get, Post } from '@nestjs/common';
import { SenderFinancialAccountsService } from './sender-financial-accounts.service';
import { CreateSenderFinancialAccountDto } from './dto/create-sender-financial-account.dto';

@Controller('sender-financial-accounts')
export class SenderFinancialAccountsController {
  constructor(
    private readonly senderFinancialAccountsService: SenderFinancialAccountsService,
  ) {}

  @Post()
  create(
    @Body() createSenderFinancialAccountDto: CreateSenderFinancialAccountDto,
  ) {
    return this.senderFinancialAccountsService.create(
      createSenderFinancialAccountDto,
    );
  }

  @Get()
  findAll() {
    return this.senderFinancialAccountsService.findAll();
  }
}
