import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  UnauthorizedException,
} from '@nestjs/common';
import { FinancialAccountsService } from './financial-accounts.service';
import { CreateFinancialAccountDto } from './dto/create-financial-accounts.dto';
import { UpdateFinancialAccountDto } from './dto/update-financial-accounts.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../common/jwt-auth.guard';
import { FinancialAccountResponseDto } from './dto/financial-accounts-response.dto';

@ApiTags('Financial Accounts')
@Controller('financial-accounts')
@UseGuards(JwtAuthGuard)
export class FinancialAccountsController {
  constructor(private readonly financialAccountsService: FinancialAccountsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new financial account' })
  @ApiResponse({
    status: 201,
    description: 'The financial account has been successfully created.',
    type: FinancialAccountResponseDto,
  })
  create(@Body() createFinancialAccountDto: CreateFinancialAccountDto, @Request() req) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-argument
    const userId = req.user?.id;
    if (!userId) throw new UnauthorizedException();
    return this.financialAccountsService.create(createFinancialAccountDto, userId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all financial accounts' })
  @ApiResponse({
    status: 200,
    description: 'Return all financial accounts.',
    type: [FinancialAccountResponseDto],
  })
  findAll() {
    return this.financialAccountsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a financial account by id' })
  @ApiResponse({
    status: 200,
    description: 'Return the financial account.',
    type: FinancialAccountResponseDto,
  })
  findOne(@Param('id') id: string) {
    return this.financialAccountsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a financial account' })
  @ApiResponse({
    status: 200,
    description: 'The financial account has been successfully updated.',
    type: FinancialAccountResponseDto,
  })
  update(@Param('id') id: string, @Body() updateFinancialAccountDto: UpdateFinancialAccountDto) {
    return this.financialAccountsService.update(id, updateFinancialAccountDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a financial account' })
  @ApiResponse({ status: 200, description: 'The financial account has been successfully deleted.' })
  remove(@Param('id') id: string) {
    return this.financialAccountsService.remove(id);
  }
}
