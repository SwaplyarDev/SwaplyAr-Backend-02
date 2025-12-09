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
} from '@nestjs/common';
import { VirtualBankAccountsService } from './virtual-bank-accounts.service';
import { CreateVirtualBankAccountDto } from './dto/create-virtual-bank-accounts.dto';
import { UpdateVirtualBankAccountDto } from './dto/update-virtual-bank-accounts.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { VirtualBankAccountResponseDto } from './dto/virtual-bank-accounts-response.dto';
import { VirtualBankAccountFilterDto } from './dto/virtual-bank-accounts-filter.dto';
import { JwtAuthGuard } from '@common/jwt-auth.guard';
import { RolesGuard } from '@common/guards/roles.guard';
import { Roles } from '@common/decorators/roles.decorator';

@ApiTags('Virtual Bank Accounts')
@Controller('virtual-bank-accounts')
export class VirtualBankAccountsController {
  constructor(private readonly virtualBankAccountsService: VirtualBankAccountsService) {}

  // ==========================================
  // CREAR UNA CUENTA BANCARIA VIRTUAL
  // ==========================================
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('user', 'admin')
  @Post()
  @ApiOperation({ summary: 'Crear una virtual bank account' })
  @ApiResponse({
    status: 201,
    description: 'The virtual bank account has been successfully created.',
    type: VirtualBankAccountResponseDto,
  })
  create(@Body() createVirtualBankAccountDto: CreateVirtualBankAccountDto, @Request() req) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-argument
    return this.virtualBankAccountsService.create(createVirtualBankAccountDto, req.user.userId);
  }

  // ==========================================
  // MOSTRAR CUENTAS BANCARIAS VIRTUALES DEL USUARIO LOGUEADO
  // ==========================================
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('user', 'admin')
  @Get('my-accounts')
  @ApiOperation({ summary: 'Obtener mis virtual bank accounts' })
  @ApiResponse({
    status: 200,
    description: 'Return user virtual bank accounts.',
    type: [VirtualBankAccountResponseDto],
  })
  findMyAccounts(@Request() req) {
    return this.virtualBankAccountsService.findByUserId(req.user.id);
  }

  // ==========================================
  // MOSTRAR TODAS LAS CUENTAS BANCARIAS VIRTUALES
  // ========================================== 
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get()
  @ApiOperation({ summary: 'Obtener todas las virtual bank accounts con filtros opcionales' })
  @ApiResponse({
    status: 200,
    description: 'Return all virtual bank accounts.',
    type: [VirtualBankAccountResponseDto],
  })
  findAll(@Query() filters: VirtualBankAccountFilterDto) {
    return this.virtualBankAccountsService.findAll(filters);
  }

  // ==========================================
  // MOSTRAR UNA CUENTA BANCARIA VIRTUAL POR ID
  // ==========================================
  @Get(':id')
  @ApiOperation({ summary: 'Obtener una virtual bank account por ID' })
  @ApiResponse({
    status: 200,
    description: 'Return the virtual bank account.',
    type: VirtualBankAccountResponseDto,
  })
  findOne(@Param('id') id: string) {
    return this.virtualBankAccountsService.findOne(id);
  }

  // ==========================================
  // ACTUALIZAR UNA CUENTA BANCARIA VIRTUAL
  // ==========================================
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('user', 'admin')
  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar una virtual bank account' })
  @ApiResponse({
    status: 200,
    description: 'The virtual bank account has been successfully updated.',
    type: VirtualBankAccountResponseDto,
  })
  update(
    @Param('id') id: string,
    @Body() updateVirtualBankAccountDto: UpdateVirtualBankAccountDto,
    @Request() req,
  ) {
    return this.virtualBankAccountsService.update(id, updateVirtualBankAccountDto, req.user.id);
  }

  // ==========================================
  // INACTIVAR (SOFT-DELETE) UNA CUENTA BANCARIA VIRTUAL
  // ==========================================
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('user', 'admin')
  @Patch(':id/deactivate')
  @ApiOperation({ summary: 'Inactivar una virtual bank account' })
  @ApiResponse({
    status: 200,
    description: 'The virtual bank account has been successfully deactivated.',
    type: VirtualBankAccountResponseDto,
  })
  inactivate(@Param('id') id: string) {
    return this.virtualBankAccountsService.inactivate(id);
  }

  // ==========================================
  // ELIMINAR UNA CUENTA BANCARIA VIRTUAL
  // ==========================================
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('user', 'admin')
  @Delete(':id')
  @ApiOperation({ summary: 'Borrar una virtual bank account' })
  @ApiResponse({
    status: 200,
    description: 'The virtual bank account has been successfully deleted.',
  })
  remove(@Param('id') id: string) {
    return this.virtualBankAccountsService.remove(id);
  }
}