import {
  Controller,
  Post,
  Delete,
  Body,
  UseGuards,
  Request,
  Get,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { CreateBankAccountDto } from './dto/create-bank-account.dto';
import { JwtAuthGuard } from '@auth/guards/jwt-auth.guard';
import { RolesGuard } from '@auth/guards/roles.guard';
import { Roles } from '@auth/decorators/roles.decorator';

import { AccountsService } from './userAccounts.service';
/*
import { DeleteBankAccountDto } from './dto/delete-bank-account.dto';

**/

@UseGuards(JwtAuthGuard)
@Controller('users/accounts')
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('user')
    @Post()
    @HttpCode(HttpStatus.CREATED)
    async create(@Request() req, @Body() dto: CreateBankAccountDto) {
    const userId = req.user.id;
    const newBank = await this.accountsService.createUserBank(
      dto.formData,
      dto.typeAccount,
      dto.userAccValues,
      userId,
    );

    return { message: 'bank created', bank: newBank };
  }
}
/*
  @Delete()
  @HttpCode(HttpStatus.OK)
  async delete(@Request() req, @Body() dto: DeleteBankAccountDto) {
    return this.accountsService.deleteBankAccount(req.user, dto.bankAccountId);
  }

  @Get()
  async findAll(@Request() req) {
    return this.accountsService.findAllByUser(req.user);
  }
}*/