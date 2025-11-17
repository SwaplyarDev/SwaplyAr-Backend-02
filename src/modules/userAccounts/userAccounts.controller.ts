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
import { AccountsService } from './userAccounts.service';
import { DeleteBankAccountDto } from './dto/delete-user-account.dto';
import { JwtAuthGuard } from 'src/common/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiBearerAuth,
  ApiQuery,
  ApiCreatedResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import {
  AuthenticatedUserAccountResponseDto,
  CreateUserAccountResponseDto,
  NotFoundUserAccountDto,
} from './dto/user-account-response.dto';
import { CreateUserAccountDto } from './dto/create-user-account.dto';
import { CreateFinancialAccountResponseDto } from './dto/create-financial-account.dto';
import { UserAccountsResponseDto } from './dto/get-user-accounts-response.dto';

@ApiTags('Cuentas de Usuario')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users/accounts')
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  // CREAR una cuenta de usuario con FinancialAccount
  @ApiOperation({
    summary: 'Crear una cuenta financiera para el usuario autenticado',
  })
  @ApiCreatedResponse({
    description: 'Cuenta financiera creada correctamente',
    type: CreateFinancialAccountResponseDto,
  })
  @ApiBody({
    description: 'Datos para crear la cuenta financiera',
    type: CreateUserAccountDto,
    examples: {
      bankExample: {
        summary: 'Cuenta bancaria',
        value: {
          platformId: 'bank',
          method: 'bank',
          bank: {
            currency: 'ARS',
            bankName: 'Banco Nación',
            sendMethodKey: 'CBU',
            sendMethodValue: '1234567890123456789012',
            documentType: 'DNI',
            documentValue: '87654321',
          },
          firstName: 'Juan',
          lastName: 'Pérez',
          accountName: 'Cuenta Principal',
        },
      },
      pixExample: {
        summary: 'Cuenta PIX',
        value: {
          platformId: 'pix',
          method: 'pix',
          pix: {
            pixId: '001',
            pixKey: 'ABC123',
            pixValue: '1234567890',
            cpf: '12345678901',
          },
          firstName: 'Juan',
          lastName: 'Pérez',
          accountName: 'Cuenta PIX Principal',
        },
      },
      virtualBankExample: {
        summary: 'Cuenta Virtual Bank',
        value: {
          platformId: 'virtual_bank',
          method: 'virtual-bank',
          virtualBank: {
            currency: 'ARS',
            emailAccount: 'nahuel@gmail.com',
            transferCode: 'XYZ123',
          },
          type: 'paypal',
          firstName: 'Juan',
          lastName: 'Pérez',
          accountName: 'Cuenta Virtual Principal',
        },
      },
      cryptoExample: {
        summary: 'Cuenta Crypto',
        value: {
          platformId: 'receiver_crypto',
          method: 'receiver-crypto',
          receiverCrypto: {
            currency: 'BTC',
            network: 'Bitcoin',
            wallet: '1A2b3C4d5E6f7G8h9I0J',
          },
          accountName: 'Cuenta Crypto Principal',
        },
      },
    },
  })
  @ApiBadRequestResponse({
    description:
      'Solicitud inválida. Asegúrate de que los datos de entrada sean correctos y válidos.',
  })
  @ApiUnauthorizedResponse({
    description: 'No autorizado. Se requiere un token de autenticación válido.',
  })
  @ApiForbiddenResponse({
    description:
      'Prohibido. El usuario no tiene los permisos necesarios para crear una cuenta financiera.',
  })
  @UseGuards(RolesGuard)
  @Roles('user')
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Request() req, @Body() body: CreateUserAccountDto) {
    const userId = req.user.id;

    const { firstName, lastName, accountName, ...createPaymentMethodDto } = body;
    const accountData = { firstName, lastName, accountName };

    const newAccount = await this.accountsService.createUserAccountWithFinancial(
      userId,
      createPaymentMethodDto,
      accountData,
    );

    return { message: 'Cuenta financiera creada correctamente', bank: newAccount };
  }

  // DELETE una cuenta de banco
  @ApiOperation({
    summary: 'Eliminar una cuenta bancaria del usuario autenticado',
  })
  @ApiBody({
    type: DeleteBankAccountDto,
    description: 'DTO con el ID de la cuenta a eliminar',
  })
  @ApiOkResponse({ description: 'Cuenta eliminada correctamente' })
  @ApiBadRequestResponse({
    description: 'Cuenta no encontrada o no pertenece al usuario',
  })
  @ApiForbiddenResponse({ description: 'No autorizado' })
  @UseGuards(RolesGuard)
  @Roles('user', 'admin')
  @Delete()
  async delete(@Request() req, @Body() dto: DeleteBankAccountDto) {
    return this.accountsService.deleteUserAccount(req.user, dto.userAccountId);
  }

  // GET todas las cuentas de banco de un user
  @UseGuards(RolesGuard)
  @Roles('user')
  @Get()
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Obtener todas las cuentas bancarias del usuario autenticado',
    description:
      'Devuelve una lista con todas las cuentas bancarias asociadas al usuario autenticado. ' +
      'El usuario debe estar logueado y tener el rol `user` para poder acceder a este endpoint.',
  })
  async findAll(@Request() req) {
    return this.accountsService.findAllAccount(req.user.id);
  }

  // GET todas las cuentas de banco de un user por admin
  @ApiOperation({
    summary: 'Obtener todas las cuentas del usuario autenticado',
  })
  @ApiQuery({
    name: 'userId',
    required: true,
    description: 'ID del usuario',
    type: String,
  })
  @ApiOkResponse({
    description: 'Lista de cuentas del usuario',
    type: [UserAccountsResponseDto],
  })
  @UseGuards(RolesGuard)
  @Roles('admin')
  @Get('/admin/findId')
  async findOneById(@Query('userId') userId: string): Promise<CreateUserAccountResponseDto[]> {
    return this.accountsService.findAllAccount(userId);
  }

  // GET una cuenta de banco de un user por admin
  @ApiOperation({
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
  @ApiOkResponse({
    description: 'Cuenta bancaria específica encontrada',
    type: AuthenticatedUserAccountResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Cuenta bancaria no encontrada o no pertenece al usuario',
    type: NotFoundUserAccountDto,
  })
  @UseGuards(RolesGuard)
  @Roles('admin')
  @Get('/admin/findUserBank')
  async findOneUserBank(
    @Query('userId') userId: string,
    @Query('bankAccountId') bankAccountId: string,
  ): Promise<CreateUserAccountResponseDto> {
    return this.accountsService.findOneUserAccount(userId, bankAccountId);
  }
}
