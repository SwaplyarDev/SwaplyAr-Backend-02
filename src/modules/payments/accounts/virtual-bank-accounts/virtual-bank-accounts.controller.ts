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
import { VirtualBankAccountsService } from './virtual-bank-accounts.service';
import { CreateVirtualBankAccountDto } from './dto/create-virtual-bank-accounts.dto';
import { UpdateVirtualBankAccountDto } from './dto/update-virtual-bank-accounts.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { VirtualBankAccountResponseDto } from './dto/virtual-bank-accounts-response.dto';
import { JwtAuthGuard } from '@common/jwt-auth.guard';
import { RolesGuard } from '@common/guards/roles.guard';
import { Roles } from '@common/decorators/roles.decorator';

@ApiTags('Virtual Bank Accounts')
@Controller('virtual-bank-accounts')
export class VirtualBankAccountsController {
  constructor(private readonly virtualBankAccountsService: VirtualBankAccountsService) {}

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

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('user')
  @Get('my-accounts')
  @ApiOperation({ summary: 'Obtener mis virtual bank accounts' })
  @ApiResponse({
    status: 200,
    description: 'Return user virtual bank accounts.',
    type: [VirtualBankAccountResponseDto],
  })
  findMyAccounts(@Request() req) {
    return this.virtualBankAccountsService.findByUserId(req.user.userId);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get()
  @ApiOperation({ summary: 'Obtener todas las virtual bank accounts' })
  @ApiResponse({
    status: 200,
    description: 'Return all virtual bank accounts.',
    type: [VirtualBankAccountResponseDto],
  })
  findAll() {
    return this.virtualBankAccountsService.findAll();
  }

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
  ) {
    return this.virtualBankAccountsService.update(id, updateVirtualBankAccountDto);
  }

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
