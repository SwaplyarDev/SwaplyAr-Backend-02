import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { FinancialAccountsService } from './financial-accounts.service';
import { CreateFinancialAccountDto } from './dto/create-financial-accounts.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiUnauthorizedResponse,
  ApiBadRequestResponse,
  ApiParam,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import {
  FinancialAccountResponseDto,
  ReceiverResponseDto,
  SenderResponseDto,
} from './dto/financial-accounts-response.dto';
import { Roles } from '@common/decorators/roles.decorator';
import { JwtAuthGuard } from '@common/jwt-auth.guard';
import { RolesGuard } from '@common/guards/roles.guard';
import { UpdateSenderFinancialAccountDto } from './sender-financial-accounts/dto/update-sender-financial-account.dto';
import { UpdateReceiverFinancialAccountDto } from './receiver-financial-accounts/dto/update-receiver-financial-account.dto';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('user')
@ApiTags('Financial Accounts')
@Controller('financial-accounts')
export class FinancialAccountController {
  constructor(private readonly financialAccountsService: FinancialAccountsService) {}

  @ApiOperation({ summary: 'Crear cuentas financieras (emisor y receptor)' })
  @ApiResponse({
    status: 201,
    description: 'Cuentas creadas correctamente',
    type: FinancialAccountResponseDto,
  })
  @ApiBody({
    description: 'Datos para crear cuentas financieras',
    type: CreateFinancialAccountDto,
    examples: {
      bankExample: {
        summary: 'Ejemplo con método bank',
        value: {
          senderAccount: {
            firstName: 'Juan',
            lastName: 'Pérez',
            paymentMethod: {
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
            },
          },
          receiverAccount: {
            firstName: 'Ana',
            lastName: 'García',
            document_value: '12345678',
            phoneNumber: '1122334455',
            email: 'ana@example.com',
            bank_name: 'Banco Galicia',
            paymentMethod: {
              platformId: 'bank',
              method: 'bank',
              bank: {
                currency: 'ARS',
                bankName: 'Banco Galicia',
                sendMethodKey: 'CBU',
                sendMethodValue: '1234567890123456789012',
                documentType: 'DNI',
                documentValue: '12345678',
              },
            },
          },
        },
      },
      pixExample: {
        summary: 'Ejemplo con método pix',
        value: {
          senderAccount: {
            firstName: 'Carlos',
            lastName: 'Lopez',
            paymentMethod: {
              platformId: 'pix',
              method: 'pix',
              pix: {
                pixId: 'vb123',
                pixKey: 'email',
                pixValue: 'carlos@example.com',
                cpf: '12345678901',
              },
            },
          },
          receiverAccount: {
            firstName: 'Lucía',
            lastName: 'Martínez',
            document_value: '87654321',
            phoneNumber: '1199887766',
            email: 'lucia@example.com',
            bank_name: 'Banco Santander',
            paymentMethod: {
              platformId: 'pix',
              method: 'pix',
              pix: {
                pixId: 'vb456',
                pixKey: 'phone',
                pixValue: '1199887766',
                cpf: '10987654321',
              },
            },
          },
        },
      },
      receiverCryptoExample: {
        summary: 'Ejemplo con método receiver-crypto',
        value: {
          senderAccount: {
            firstName: 'Diego',
            lastName: 'Fernández',
            paymentMethod: {
              platformId: 'receiver_crypto',
              method: 'receiver-crypto',
              receiverCrypto: {
                currency: 'ARS',
                network: 'Bitcoin',
                wallet: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
              },
            },
          },
          receiverAccount: {
            firstName: 'María',
            lastName: 'González',
            document_value: '34567890',
            phoneNumber: '1144778899',
            email: 'maria@example.com',
            bank_name: 'Crypto Bank',
            paymentMethod: {
              platformId: 'receiver_crypto',
              method: 'receiver-crypto',
              receiverCrypto: {
                currency: 'ETH',
                network: 'Ethereum',
                wallet: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
              },
            },
          },
        },
      },
      virtualBankExample: {
        summary: 'Ejemplo con método virtual-bank',
        value: {
          senderAccount: {
            firstName: 'Sofía',
            lastName: 'Ruiz',
            paymentMethod: {
              platformId: 'virtual_bank',
              method: 'virtual-bank',
              virtualBank: {
                currency: 'ARS',
                emailAccount: 'sofia@example.com',
                transferCode: 'TC123456',
              },
            },
          },
          receiverAccount: {
            firstName: 'Pedro',
            lastName: 'Santos',
            document_value: '56789012',
            phoneNumber: '1177665544',
            email: 'pedro@example.com',
            bank_name: 'Banco Virtual',
            paymentMethod: {
              platformId: 'virtual_bank',
              method: 'virtual-bank',
              virtualBank: {
                currency: 'ARS',
                emailAccount: 'pedro@example.com',
                transferCode: 'TC654321',
              },
            },
          },
        },
      },
    },
  })
  @ApiForbiddenResponse({
    description: 'Autorización no permitida, solo para usuarios',
  })
  @ApiUnauthorizedResponse({
    description: 'No autorizado. Token no válido o no enviado.',
  })
  @ApiBadRequestResponse({
    description:
      'Datos inválidos: campos vacíos requeridos, método de pago, plataforma o email incorrectos.',
  })
  @Post()
  async create(@Body() createFinancialAccountDto: CreateFinancialAccountDto) {
    return this.financialAccountsService.create(createFinancialAccountDto);
  }

  @ApiOperation({ summary: 'Obtener todas las cuentas financieras emisoras' })
  @ApiResponse({
    status: 200,
    description: 'Lista de cuentas emisoras',
    type: [SenderResponseDto],
  })
  @ApiUnauthorizedResponse({
    description: 'No autorizado. Token no válido o no enviado.',
  })
  @ApiForbiddenResponse({
    description: 'Autorización no permitida, solo para usuarios',
  })
  @Get('/sender')
  async findAllSender() {
    return await this.financialAccountsService.findAllSender();
  }

  @ApiOperation({ summary: 'Obtener todas las cuentas financieras receptoras' })
  @ApiResponse({
    status: 200,
    description: 'Lista de cuentas receptoras',
    type: [ReceiverResponseDto],
  })
  @ApiForbiddenResponse({
    description: 'Autorización no permitida, solo para usuarios',
  })
  @ApiUnauthorizedResponse({
    description: 'No autorizado. Token no válido o no enviado.',
  })
  @Get('/receiver')
  async findAllReceiver() {
    return await this.financialAccountsService.findAllReceiver();
  }

  @ApiOperation({ summary: 'Actualizar una cuenta emisora' })
  @ApiBody({
    description: 'Datos para actualizar cuenta emisora',
    type: UpdateSenderFinancialAccountDto,
    examples: {
      bankExample: {
        summary: 'Ejemplo válido con método bank',
        value: {
          firstName: 'Nahuel',
          lastName: 'Davila',
          paymentMethod: {
            platformId: 'bank',
            method: 'bank',
            bank: {
              currency: 'ARS',
              bankName: 'Banco Santander',
              sendMethodKey: 'CBU',
              sendMethodValue: '1234567890123456789012',
              documentType: 'DNI',
              documentValue: '12345678',
            },
          },
        },
      },
      pixExample: {
        summary: 'Ejemplo válido con método pix',
        value: {
          firstName: 'Carlos',
          lastName: 'Lopez',
          paymentMethod: {
            platformId: 'pix',
            method: 'pix',
            pix: {
              virtualBankId: 'vb123',
              pixKey: 'email',
              pixValue: 'carlos@example.com',
              cpf: '12345678901',
            },
          },
        },
      },
      receiverCryptoExample: {
        summary: 'Ejemplo válido con método receiver-crypto',
        value: {
          firstName: 'Diego',
          lastName: 'Fernández',
          paymentMethod: {
            platformId: 'receiver_crypto',
            method: 'receiver-crypto',
            receiverCrypto: {
              currency: 'ARS',
              network: 'Bitcoin',
              wallet: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
            },
          },
        },
      },
      virtualBankExample: {
        summary: 'Ejemplo válido con método virtual-bank',
        value: {
          firstName: 'Sofía',
          lastName: 'Ruiz',
          paymentMethod: {
            platformId: 'virtual_bank',
            method: 'virtual-bank',
            virtualBank: {
              currency: 'ARS',
              emailAccount: 'sofia@example.com',
              transferCode: 'TC123456',
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Cuenta emisora actualizada correctamente',
    type: ReceiverResponseDto,
  })
  @ApiBadRequestResponse({
    description:
      '400.1 - Datos inválidos. El objeto `paymentMethod` es opcional, pero si desea modificar debe incluir todos sus campos requeridos según el método de pago especificado (`bank`, `pix`, `receiver-crypto`, `virtual-bank`). ' +
      '400.2 -Campos como `firstName`, `lastName`, `document_value`, `email`, `phoneNumber` y `bank_name` son opcionales, pero si se envían, deben ser cadenas válidas.' +
      '400.3 -Formato de ID inválido. Debe ser un UUID válido.\n\n' +
      '400.4 - Método de pago inválido. No puede cambiar el método de pago registrado. Por ejemplo: ' +
      "`Método de pago inválido. Esta cuenta tiene registrado platformId: 'bank' y method: 'bank', no puede cambiarse a 'pix' / 'pix'.`",
  })
  @ApiNotFoundResponse({
    description: '404 - Cuenta emisora con el ID especificado no encontrada.',
  })
  @ApiUnauthorizedResponse({
    description: '401 - No autorizado. Token no válido o no enviado.',
  })
  @ApiForbiddenResponse({
    description: '403 - Autorización no permitida, solo para usuarios.',
  })
  @Patch('/sender/:id')
  async updateSenderAccount(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() updateSenderDto: UpdateSenderFinancialAccountDto,
  ) {
    return this.financialAccountsService.updateSender(id, updateSenderDto);
  }

  @ApiOperation({ summary: 'Actualizar una cuenta receptora' })
  @ApiBody({
    description: 'Datos para actualizar cuenta receptora',
    type: UpdateReceiverFinancialAccountDto,
    examples: {
      bankExample: {
        summary: 'Ejemplo válido con método bank',
        value: {
          firstName: 'Ana',
          lastName: 'García',
          document_value: '12345678',
          phoneNumber: '1122334455',
          email: 'ana@example.com',
          bank_name: 'Banco Galicia',
          paymentMethod: {
            platformId: 'bank',
            method: 'bank',
            bank: {
              currency: 'ARS',
              bankName: 'Banco Galicia',
              sendMethodKey: 'CBU',
              sendMethodValue: '1234567890123456789012',
              documentType: 'DNI',
              documentValue: '12345678',
            },
          },
        },
      },
      pixExample: {
        summary: 'Ejemplo válido con método pix',
        value: {
          firstName: 'Lucía',
          lastName: 'Martínez',
          document_value: '87654321',
          phoneNumber: '1199887766',
          email: 'lucia@example.com',
          bank_name: 'Banco Santander',
          paymentMethod: {
            platformId: 'pix',
            method: 'pix',
            pix: {
              virtualBankId: 'vb456',
              pixKey: 'phone',
              pixValue: '1199887766',
              cpf: '10987654321',
            },
          },
        },
      },
      receiverCryptoExample: {
        summary: 'Ejemplo válido con método receiver-crypto',
        value: {
          firstName: 'María',
          lastName: 'González',
          document_value: '34567890',
          phoneNumber: '1144778899',
          email: 'maria@example.com',
          bank_name: 'Crypto Bank',
          paymentMethod: {
            platformId: 'receiver_crypto',
            method: 'receiver-crypto',
            receiverCrypto: {
              currency: 'ETH',
              network: 'Ethereum',
              wallet: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
            },
          },
        },
      },
      virtualBankExample: {
        summary: 'Ejemplo válido con método virtual-bank',
        value: {
          firstName: 'Pedro',
          lastName: 'Santos',
          document_value: '56789012',
          phoneNumber: '1177665544',
          email: 'pedro@example.com',
          bank_name: 'Banco Virtual',
          paymentMethod: {
            platformId: 'virtual_bank',
            method: 'virtual-bank',
            virtualBank: {
              currency: 'ARS',
              emailAccount: 'pedro@example.com',
              transferCode: 'TC654321',
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Cuenta receptora actualizada correctamente',
    type: ReceiverResponseDto,
  })
  @ApiBadRequestResponse({
    description:
      '400.1 - Datos inválidos. El objeto `paymentMethod` es opcional, pero si desea modificar debe incluir todos sus campos requeridos según el método de pago especificado (`bank`, `pix`, `receiver-crypto`, `virtual-bank`). ' +
      '400.2 -Campos como `firstName`, `lastName`, `document_value`, `email`, `phoneNumber` y `bank_name` son opcionales, pero si se envían, deben ser cadenas válidas.' +
      '400.3 -Formato de ID inválido. Debe ser un UUID válido.\n\n' +
      '400.4 - Método de pago inválido. No puede cambiar el método de pago registrado. Por ejemplo: ' +
      "`Método de pago inválido. Esta cuenta tiene registrado platformId: 'bank' y method: 'bank', no puede cambiarse a 'pix' / 'pix'.`",
  })
  @ApiNotFoundResponse({
    description: '404 - Cuenta receptora con el ID especificado no encontrada.',
  })
  @ApiUnauthorizedResponse({
    description: '401 - No autorizado. Token no válido o no enviado.',
  })
  @ApiForbiddenResponse({
    description: '403 - Autorización no permitida, solo para usuarios.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID de la cuenta receptora a actualizar (UUID v4)',
  })
  @Patch('/receiver/:id')
  async updateReceiverAccount(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() updateReceiverDto: UpdateReceiverFinancialAccountDto,
  ) {
    return this.financialAccountsService.updateReceiver(id, updateReceiverDto);
  }

  @ApiOperation({ summary: 'Eliminar una cuenta financiera por ID' })
  @ApiParam({
    name: 'id',
    description: 'ID de la cuenta financiera a eliminar',
  })
  @ApiResponse({ status: 200, description: 'Cuenta eliminada correctamente' })
  @ApiNotFoundResponse({ description: 'Cuenta no encontrada' })
  @ApiBadRequestResponse({
    description: 'Formato de ID inválido. Debe ser un UUID válido.',
  })
  @ApiUnauthorizedResponse({
    description: 'No autorizado. Token no válido o no enviado.',
  })
  @ApiForbiddenResponse({
    description: 'Autorización no permitida, solo para usuarios',
  })
  @Delete(':id')
  async deleteAccount(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    await this.financialAccountsService.deleteById(id);
    return { message: 'Cuenta eliminada correctamente', id };
  }
}
