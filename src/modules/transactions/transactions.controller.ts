import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
  UseGuards,
  Query,
  Req,
  Request,
} from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { plainToInstance } from 'class-transformer';
import { FileUploadDTO } from '../file-upload/dto/file-upload.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiConsumes,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Transaction } from './entities/transaction.entity';
import {
  TransactionGetResponseDto,
  TransactionResponseDto,
} from './dto/transaction-response.dto';
import { UserStatusHistoryResponseDto } from './dto/user-status-history.dto';
import { JwtService } from '@nestjs/jwt';

interface CreateTransactionBody {
  createTransactionDto: string;
  file?: Express.Multer.File;
}

interface RequestWithUser extends Request {
  user: {
    email: string;
    [key: string]: unknown;
  };
}

@ApiTags('Transacciones')
@Controller('transactions')
export class TransactionsController {
  constructor(
    private readonly transactionsService: TransactionsService,
    private readonly jwtService: JwtService,
  ) {}

  @ApiOperation({
    summary: 'Crear una transacción con comprobante de pago',
    description: `
    Este endpoint permite crear una nueva transacción con todos los datos requeridos y un comprobante de pago.
    - El campo **createTransactionDto** debe enviarse como un **string JSON válido**.
    - El campo mesagge es opcional, pero si se envía debe ser un texto.
    - El comprobante de pago debe enviarse como archivo en el campo **file** (formato *multipart/form-data*).
    - Todos los campos indicados como obligatorios en el DTO deben estar completos.
    - Se validan y almacenan las cuentas financieras, montos y comprobante.
    - Si alguna validación falla, se devuelve un error detallado.
  `,
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        createTransactionDto: {
          type: 'string',
          description:
            'JSON stringificado con la información de la transacción (CreateTransactionDto)',
          example: JSON.stringify(
            {
              bankExample: {
                paymentsId: '123',
                countryTransaction: 'Argentina',
                message: 'Transferencia de prueba',
                financialAccounts: {
                  senderAccount: {
                    firstName: 'Juan',
                    lastName: 'Pérez',
                    phoneNumber: '12456789',
                    createdBy: 'fernandeezalan20@gmail.com',
                    paymentMethod: { platformId: 'bank', method: 'bank' },
                  },
                  receiverAccount: {
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
                amount: {
                  amountSent: 1000,
                  currencySent: 'ARS',
                  amountReceived: 900,
                  currencyReceived: 'BRL',
                  received: false,
                },
              },
              pixExample: {
                paymentsId: '124',
                countryTransaction: 'Argentina',
                message: 'Transferencia PIX',
                financialAccounts: {
                  senderAccount: {
                    firstName: 'Carlos',
                    lastName: 'Lopez',
                    phoneNumber: '12456789',
                    createdBy: 'fernandeezalan20@gmail.com',
                    paymentMethod: { platformId: 'pix', method: 'pix' },
                  },
                  receiverAccount: {
                    paymentMethod: {
                      platformId: 'pix',
                      method: 'pix',
                      pix: {
                        pixId: 'vb456',
                        pixKey: 'email',
                        pixValue: 'lucia@example.com',
                        cpf: '10987654321',
                      },
                    },
                  },
                },
                amount: {
                  amountSent: 500,
                  currencySent: 'ARS',
                  amountReceived: 500,
                  currencyReceived: 'ARS',
                  received: true,
                },
              },
              virtualBankExample: {
                paymentsId: '125',
                countryTransaction: 'Argentina',
                message: 'Transferencia Virtual Bank',
                financialAccounts: {
                  senderAccount: {
                    firstName: 'Sofía',
                    lastName: 'Ruiz',
                    phoneNumber: '12456789',
                    createdBy: 'fernandeezalan20@gmail.com',
                    paymentMethod: {
                      platformId: 'virtual_bank',
                      method: 'virtual-bank',
                    },
                  },
                  receiverAccount: {
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
                amount: {
                  amountSent: 1200,
                  currencySent: 'ARS',
                  amountReceived: 1200,
                  currencyReceived: 'ARS',
                  received: false,
                },
              },
              receiverCryptoExample: {
                paymentsId: '126',
                countryTransaction: 'Argentina',
                message: 'Transferencia Crypto',
                financialAccounts: {
                  senderAccount: {
                    firstName: 'Diego',
                    lastName: 'Fernández',
                    phoneNumber: '12456789',
                    createdBy: 'fernandeezalan20@gmail.com',
                    paymentMethod: {
                      platformId: 'receiver_crypto',
                      method: 'receiver-crypto',
                    },
                  },
                  receiverAccount: {
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
                amount: {
                  amountSent: 0.5,
                  currencySent: 'ETH',
                  amountReceived: 0.5,
                  currencyReceived: 'ETH',
                  received: true,
                },
              },
            },
            null,
            2,
          ),
        },
        file: {
          type: 'string',
          format: 'binary',
          description: 'Archivo del comprobante de pago (JPG, PNG o PDF)',
        },
      },
      required: ['createTransactionDto'],
    },
  })
  @ApiResponse({
    status: 201,
    description: '✅ Transacción creada correctamente',
    type: TransactionResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: `
    ❌ Error en los datos enviados:
    - El body está vacío.
    - El campo createTransactionDto es requerido.
    - El campo createTransactionDto no es un JSON válido.
    - Faltan campos obligatorios en el DTO.
    - Error en la creación de cuentas financieras, monto o comprobante de pago.
  `,
  })
  @ApiResponse({
    status: 404,
    description:
      '❌ Recurso no encontrado (por ejemplo, cuenta o transacción relacionada no existe)',
  })
  @ApiResponse({
    status: 500,
    description: '❌ Error interno del servidor',
  })
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async create(
    @Body() body: CreateTransactionBody,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!body || Object.keys(body).length === 0) {
      throw new BadRequestException('El body está vacío');
    }

    if (!body.createTransactionDto) {
      throw new BadRequestException(
        'El campo createTransactionDto es requerido. Body recibido: ' +
          JSON.stringify(body),
      );
    }

    let parsedDto: Partial<CreateTransactionDto>;
    try {
      parsedDto = JSON.parse(
        body.createTransactionDto,
      ) as Partial<CreateTransactionDto>;
    } catch {
      throw new BadRequestException(
        'El campo createTransactionDto debe ser un JSON válido',
      );
    }

    const createTransactionDto = plainToInstance(
      CreateTransactionDto,
      parsedDto,
    );

    const fileData: FileUploadDTO = file
      ? {
          buffer: file.buffer,
          fieldName: file.fieldname,
          mimeType: file.mimetype,
          originalName: file.originalname,
          size: file.size,
        }
      : {
          buffer: Buffer.from(''),
          fieldName: '',
          mimeType: '',
          originalName: '',
          size: 0,
        };

    return await this.transactionsService.create(
      createTransactionDto,
      fileData,
    );
  }

  // Obtener historial de estados (público)
  @Get('status/:id')
  @ApiOperation({ summary: 'Obtener historial público de una transacción' })
  @ApiQuery({ name: 'lastName', required: true, type: String })
  @ApiResponse({
    status: 200,
    description: '✅ Historial de estados obtenido correctamente',
    type: UserStatusHistoryResponseDto,
  })
  @ApiResponse({
    status: 401,
    description:
      '❌ El apellido no coincide con el remitente de la transacción.',
  })
  @ApiResponse({
    status: 404,
    description: '❌ Transacción no encontrada o sin historial disponible.',
  })
  async getPublicStatusHistory(
    @Param('id') id: string,
    @Query('lastName') lastName: string,
  ): Promise<UserStatusHistoryResponseDto> {
    const history = await this.transactionsService.getPublicStatusHistory(
      id,
      lastName,
    );
    return {
      success: true,
      message: 'Historial obtenido correctamente',
      data: history,
    };
  }

  // Obtener todas las transacciones (Usuario Autenticado)
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('user')
  @Get()
  @ApiOperation({
    summary: 'Obtener todas las transacciones del usuario autenticado',
  })
  @ApiResponse({
    type: [TransactionGetResponseDto],
    status: 200,
    description:
      '✅ Lista de transacciones o mensaje indicando que no hay transacciones',
  })
  @ApiResponse({
    status: 401,
    description:
      '❌ Token no proporcionado o inválido. El usuario debe autenticarse para acceder a las transacciones.',
  })
  @ApiResponse({
    status: 403,
    description: '❌ Acceso prohibido. El acceso es solo para Usuarios.',
  })
  async findAll(
    @Req() req: RequestWithUser,
    @Query('page') page: string = '1',
    @Query('pageSize') pageSize: string = '10',
  ): Promise<{
    data: TransactionGetResponseDto[];
    pagination: {
      page: number;
      pageSize: number;
      totalItems: number;
      totalPages: number;
    };
  }> {
    const pageNumber = parseInt(page, 10);
    const pageSizeNumber = parseInt(pageSize, 10);
    const email = req.user.email;

    return await this.transactionsService.findAllUserEmail(
      email,
      pageNumber,
      pageSizeNumber,
    );
  }

  // Obtener transacción por ID con autorización
  @Get(':transaction_id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('user')
  @ApiOperation({
    summary:
      'Obtiene una transacción específica por su ID verificando el email del usuario',
  })
  @ApiResponse({
    status: 200,
    description: '✅ La transacción fue encontrada y el usuario tiene acceso',
    type: Transaction,
  })
  @ApiResponse({
    status: 403,
    description: 'Acceso no autorizado a la transacción',
  })
  @ApiResponse({ status: 404, description: 'Transacción no encontrada' })
  async getTransactionByEmail(
    @Param('transaction_id') transactionId: string,
    @Request() req: RequestWithUser,
  ) {
    const userEmail = req.user.email;
    return this.transactionsService.getTransactionByEmail(
      transactionId,
      userEmail,
    );
  }
}
