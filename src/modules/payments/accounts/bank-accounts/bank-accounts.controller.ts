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
} from '@nestjs/common';
import { BankAccountsService } from './bank-accounts.service';
import { CreateBankAccountDto } from './dto/create-bank-accounts.dto';
import { UpdateBankAccountDto } from './dto/update-bank-accounts.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../../common/jwt-auth.guard';
import { BankAccountResponseDto } from './dto/bank-accounts-response.dto';
import { RolesGuard } from '../../../../common/guards/roles.guard';
import { Roles } from '../../../../common/decorators/roles.decorator';

@ApiTags('Bank Accounts')
@Controller('bank-accounts')
export class BankAccountsController {
  constructor(private readonly bankAccountsService: BankAccountsService) {}

  // ==========================================
  // CREAR UNA CUENTA BANCARIA
  // ==========================================
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('user', 'admin')
  @Post()
  @ApiOperation({ summary: 'Create a new bank account' })
  @ApiResponse({
    status: 201,
    description: 'The bank account has been successfully created.',
    type: BankAccountResponseDto,
  })
  create(@Body() createBankAccountDto: CreateBankAccountDto, @Request() req) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-argument
    return this.bankAccountsService.create(createBankAccountDto, req.user.userId);
  }

  // ==========================================
  // MOSTRAR TODAS LAS CUENTAS BANCARIAS
  // ==========================================
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get()
  @ApiOperation({ summary: 'Get all bank accounts' })
  @ApiResponse({
    status: 200,
    description: 'Return all bank accounts.',
    type: [BankAccountResponseDto],
  })
  findAll() {
    return this.bankAccountsService.findAll();
  }

  // ==========================================
  // MOSTRAR CUENTAS BANCARIAS DEL USUARIO LOGUEADO
  // ==========================================
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('user', 'admin')
  @Get('my-accounts')
  @ApiOperation({ summary: 'Get my bank accounts' })
  @ApiResponse({
    status: 200,
    description: 'Return bank accounts belonging to the logged user.',
    type: [BankAccountResponseDto],
  })
  findMine(@Request() req) {
    return this.bankAccountsService.findByUser(req.user.userId);
  }

  // ==========================================
  // MOSTRAR UNA CUENTA BANCARIA POR ID
  // ==========================================
  @Get(':id')
  @ApiOperation({ summary: 'Get a bank account by id' })
  @ApiResponse({
    status: 200,
    description: 'Return the bank account.',
    type: BankAccountResponseDto,
  })
  findOne(@Param('id') id: string) {
    return this.bankAccountsService.findOne(id);
  }

  // ==========================================
  // ACTUALIZAR UNA CUENTA BANCARIA
  // ==========================================
  @Patch(':id')
  @ApiOperation({ summary: 'Update a bank account' })
  @ApiResponse({
    status: 200,
    description: 'The bank account has been successfully updated.',
    type: BankAccountResponseDto,
  })
  update(@Param('id') id: string, @Body() updateBankAccountDto: UpdateBankAccountDto) {
    return this.bankAccountsService.update(id, updateBankAccountDto);
  }

  // ==========================================
  // ELIMINAR UNA CUENTA BANCARIA
  // ==========================================
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('user', 'admin')
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a bank account' })
  @ApiResponse({ status: 200, description: 'The bank account has been successfully deleted.' })
  remove(@Param('id') id: string) {
    return this.bankAccountsService.remove(id);
  }
}
