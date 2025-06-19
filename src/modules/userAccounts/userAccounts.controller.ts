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
import { AccountsService } from './userAccounts.service';
import { DeleteBankAccountDto } from './dto/delete-bank-account.dto';
import { JwtAuthGuard } from 'src/common/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

@ApiTags('Cuentas de Usuario')
@UseGuards(JwtAuthGuard)
@Controller('users/accounts')
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @ApiOperation({ summary: 'Crear una cuenta bancaria para el usuario autenticado' })
  @ApiResponse({ status: 201, description: 'Cuenta bancaria creada correctamente', schema: {
    example: {
      message: 'bank created',
      bank: {
        id: 'uuid',
        typeAccount: 'bank',
        formData: { /* ... */ },
        userAccValues: {
          first_name: 'Juan',
          last_name: 'Pérez',
          identification: '12345678',
          currency: 'ARS',
          account_name: 'Cuenta Principal',
          account_type: 1
        }
      }
    }
  }})
  @ApiBody({
    description: 'Datos para crear la cuenta bancaria',
    type: CreateBankAccountDto,
    examples: {
      ejemplo1: {
        summary: 'Ejemplo de request',
        value: {
          typeAccount: 'bank',
          formData: {
            bankName: 'Banco Nación',
            cbu: '1234567890123456789012',
            alias: 'juan.nacion',
            branch: 'Sucursal Centro'
          },
          userAccValues: {
            first_name: 'Juan',
            last_name: 'Pérez',
            identification: '12345678',
            currency: 'ARS',
            account_name: 'Cuenta Principal',
            account_type: 1
          }
        }
      }
    }
  })
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

  @ApiOperation({ summary: 'Eliminar una cuenta bancaria del usuario autenticado' })
  @ApiResponse({ status: 200, description: 'Cuenta bancaria eliminada correctamente', schema: {
    example: { message: 'Cuenta bancaria eliminada correctamente' }
  }})
  @ApiBody({
    description: 'Datos para eliminar la cuenta bancaria',
    type: DeleteBankAccountDto,
    examples: {
      ejemplo1: {
        summary: 'Ejemplo de request',
        value: {
          bankAccountId: 'uuid-cuenta-banco'
        }
      }
    }
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('user')
  @Delete()
  @HttpCode(HttpStatus.OK)
  async delete(@Request() req, @Body() dto: DeleteBankAccountDto) {
    return this.accountsService.deleteBankAccount(req.user, dto.bankAccountId);
  }

  @ApiOperation({ summary: 'Obtener todas las cuentas del usuario autenticado' })
  @ApiResponse({ status: 200, description: 'Lista de cuentas del usuario', schema: {
    example: [
      {
        id: 'uuid',
        typeAccount: 'bank',
        formData: { /* ... */ },
        userAccValues: {
          first_name: 'Juan',
          last_name: 'Pérez',
          identification: '12345678',
          currency: 'ARS',
          account_name: 'Cuenta Principal',
          account_type: 1
        }
      }
    ]
  }})
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('user')
  @Get()
  async findAll(@Request() req) {
    return this.accountsService.findAllByUser(req.user);
  }
}