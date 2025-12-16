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
  Query,
  UnauthorizedException,
} from '@nestjs/common';
import { BankAccountsService } from './bank-accounts.service';
import { CreateBankAccountDto } from './dto/create-bank-accounts.dto';
import { UpdateBankAccountDto } from './dto/update-bank-accounts.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../../common/jwt-auth.guard';
import { BankAccountResponseDto } from './dto/bank-accounts-response.dto';
import { RolesGuard } from '../../../../common/guards/roles.guard';
import { Roles } from '../../../../common/decorators/roles.decorator';
import { BankAccountFilterDto } from './dto/bank-accounts-filter.dto';

@ApiTags('Bank Accounts')
@Controller('bank-accounts')
export class BankAccountsController {
  constructor(private readonly bankAccountsService: BankAccountsService) { }

  // ==========================================
  // CREAR UNA CUENTA BANCARIA
  // ==========================================
  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('user', 'admin')
  @ApiOperation({ summary: 'Crear una nueva bank account' })
  @ApiResponse({
    status: 201,
    description: 'The bank account has been successfully created.',
    type: BankAccountResponseDto,
  })
  create(@Body() createBankAccountDto: CreateBankAccountDto, @Request() req) {
    // Verifica que el usuario esté autenticado
    const userId = req.user?.id;
    if (!userId) throw new UnauthorizedException();
    return this.bankAccountsService.create(createBankAccountDto, userId);
  }

  // ==========================================
  // MOSTRAR TODAS LAS CUENTAS BANCARIAS
  // ==========================================
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get()
  @ApiOperation({ summary: 'Obtener todas las bank accounts con filtros opcionales' })
  @ApiResponse({
    status: 200,
    description: 'Return all bank accounts.',
    type: [BankAccountResponseDto],
  })
  findAll(@Query() filters: BankAccountFilterDto) {
    return this.bankAccountsService.findAll(filters);
  }

  // ==========================================
  // MOSTRAR CUENTAS BANCARIAS DEL USUARIO LOGUEADO
  // ==========================================
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('user', 'admin')
  @Get('my-accounts')
  @ApiOperation({ summary: 'Obtener mis bank accounts' })
  @ApiResponse({
    status: 200,
    description: 'Return bank accounts belonging to the logged user.',
    type: [BankAccountResponseDto],
  })
  findMine(@Request() req) {
    return this.bankAccountsService.findByUser(req.user.id);
  }

  // ==========================================
  // MOSTRAR UNA CUENTA BANCARIA POR ID
  // ==========================================
  @Get(':id')
  @ApiOperation({ summary: 'Obtener una bank account por id' })
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
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('user', 'admin')
  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar una bank account' })
  @ApiResponse({
    status: 200,
    description: 'The bank account has been successfully updated.',
    type: BankAccountResponseDto,
  })
  update(
    @Param('id') id: string,
    @Body() updateBankAccountDto: UpdateBankAccountDto,
    @Request() req,
  ) {
    return this.bankAccountsService.update(id, updateBankAccountDto, req.user.id);
  }

  // ==========================================
  // INACTIVAR (SOFT-DELETE) UNA CUENTA BANCARIA
  // ==========================================
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('user', 'admin')
  @Patch(':id/deactivate')
  @ApiOperation({ summary: 'Inactivar una virtual bank account' })
  @ApiResponse({
    status: 200,
    description: 'The virtual bank account has been successfully deactivated.',
    type: BankAccountResponseDto,
  })
  inactivate(@Param('id') id: string) {
    return this.bankAccountsService.inactivate(id);
  }

  // ==========================================
  // ELIMINAR UNA CUENTA BANCARIA
  // ==========================================
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('user', 'admin')
  @Delete(':id')
  @ApiOperation({ summary: 'Borrar una bank account' })
  @ApiResponse({
    status: 200,
    description: 'The bank account has been successfully deleted.',
  })
  remove(@Param('id') id: string) {
    return this.bankAccountsService.remove(id);
  }
}
