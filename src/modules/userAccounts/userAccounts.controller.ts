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
  Query,
} from '@nestjs/common';
import { CreateBankAccountDto } from './dto/create-bank-account.dto';
import { AccountsService } from './userAccounts.service';
import { DeleteBankAccountDto } from './dto/delete-bank-account.dto';
import { JwtAuthGuard } from 'src/common/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';

//TODO: GET (user/accounts/:id) ,  GET (user/user:id/accounts) , GET (user/user:id/accounts/account:id),

@ApiTags('Cuentas de Usuario')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users/accounts')
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @ApiOperation({
    summary: 'Crear una cuenta bancaria para el usuario autenticado',
  })
  @ApiResponse({
    status: 201,
    description: 'Cuenta bancaria creada correctamente',
    schema: {
      example: {
        message: 'bank created',
        bank: {
          id: 'uuid',
          typeAccount: 'bank',
          formData: {
            /* ... */
          },
          userAccValues: {
            first_name: 'Juan',
            last_name: 'Pérez',
            identification: '12345678',
            currency: 'ARS',
            account_name: 'Cuenta Principal',
            account_type: 1,
          },
        },
      },
    },
  })
  @ApiBody({
    description: 'Datos para crear la cuenta bancaria',
    type: CreateBankAccountDto,
    examples: {
      ejemplo1: {
        summary: 'Ejemplo de request',
        value: {
          typeAccount: 'bank',
          formData: {
            currency: 'ARS',
            bank_name: 'Banco Nación',
            send_method_key: 'CBU',
            send_method_value: '1234567890123456789012',
            document_type: 'DNI',
            document_value: '12345678',
            alias: 'juan.nacion',
            branch: 'Sucursal Centro',
          },
          userAccValues: {
            first_name: 'Juan',
            last_name: 'Pérez',
            identification: '12345678',
            currency: 'ARS',
            account_name: 'Cuenta Principal',
            account_type: 1,
          },
        },
      },
    },
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  /*  @Roles('user') */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Request() req, @Body() dto: CreateBankAccountDto) {
    const userId = req.user.id;
    console.log('user');

    const newBank = await this.accountsService.createUserBank(
      dto.userAccValues.accountType,
      dto.userAccValues,
      userId,
    );

    return { message: 'Banco creado correctamente', bank: newBank };
  }

  //no lelva documentacion de swagger

  /*   @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('user')
  @Delete()
  @HttpCode(HttpStatus.OK)
  async delete(@Request() req, @Body() dto: DeleteBankAccountDto) {
    return this.accountsService.deleteBankAccount(req.user, dto.bankAccountId);
  } */

  @ApiOperation({
    summary: 'Obtener todas las cuentas del usuario autenticado',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de cuentas del usuario',
    schema: {
      example: [
        {
          id: 'uuid',
          typeAccount: 'bank',
          formData: {},
          userAccValues: {
            first_name: 'Juan',
            last_name: 'Pérez',
            identification: '12345678',
            currency: 'ARS',
            account_name: 'Cuenta Principal',
            account_type: 1,
          },
        },
      ],
    },
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  /*   @Roles('user') */
  @Get()
  async findAll(@Request() req) {
    return this.accountsService.findAllBanks(req.user.id);
  }

  // Obtener todas las cuentas de banco de un user
  /*   @ApiOperation({
    summary: 'Obtener todas las cuentas del usuario autenticado',
  })
  @ApiQuery({
    name: 'userId',
    required: true,
    description: 'ID del usuario',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de cuentas del usuario',
    schema: {
      example: [
        {
          id: 'uuid',
          typeAccount: 'bank',
          formData: {},
          userAccValues: {
            first_name: 'Juan',
            last_name: 'Pérez',
            identification: '12345678',
            currency: 'ARS',
            account_name: 'Cuenta Principal',
            account_type: 1,
          },
        },
      ],
    },
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get('/admin/findId')
  async findOneById(@Query('userId') userId: string) {
    return this.accountsService.findAllBanks(userId);
  } */

  // obtener una cuenta

  /*   @ApiOperation({
    summary: 'Obtener una cuenta bancaria específica de un usuario autenticado',
  })
  @ApiQuery({
    name: 'userId',
    required: true,
    description: 'ID del usuario',
    type: String,
  })
  @ApiQuery({
    name: 'bankAccountId',
    required: true,
    description: 'ID específico de la cuenta bancaria',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Cuenta bancaria específica encontrada',
    schema: {
      example: {
        accountName: 'Dylan',
        currency: 'USD',
        status: true,
        payment_type: 'paypal',
        details: [
          {
            account_id: 'f4338078-8c08-468c-ad92-134d37e0b405',
            email_account: 'dylan.rojo@paypal.com',
            transfer_code: 987654,
          },
        ],
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Cuenta bancaria no encontrada o no pertenece al usuario',
    schema: {
      example: { message: 'Cuenta no encontrada para este usuario' },
    },
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get('/admin/findUserBank')
  async findOneUserBank(
    @Query('userId') userId: string,
    @Query('bankAccountId') bankAccountId: string,
  ) {
    return this.accountsService.findOneUserBank(userId, bankAccountId);
  } */
}
