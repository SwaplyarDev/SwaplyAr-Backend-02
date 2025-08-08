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
  Request,
  Query,
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
import { UserStatusHistoryResponseDto } from './dto/user-status-history.dto';

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
  constructor(private readonly transactionsService: TransactionsService) {}

  // Crear transacción
  @ApiOperation({ summary: 'Crear una transacción con comprobante (opcional)' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description:
      'Datos para crear una transacción. El campo createTransactionDto debe ser un string JSON con la estructura de CreateTransactionDto. El campo file es opcional.',
    schema: {
      type: 'object',
      properties: {
        createTransactionDto: {
          type: 'string',
          example: JSON.stringify({
            paymentsId: '123',
            countryTransaction: 'Argentina',
            message: 'Transferencia de prueba',
            createdBy: 'fernandeezalan20@gmail.com',
            financialAccounts: {
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
                email: 'brasil@swaplyar.com',
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
            amount: {
              amountSent: 1000,
              currencySent: 'ARS',
              amountReceived: 900,
              currencyReceived: 'BRL',
              received: false,
            },
          }),
        },
        file: {
          type: 'string',
          format: 'binary',
          description: 'Comprobante de la transacción (opcional)',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Transacción creada correctamente',
    schema: {
      example: {
        id: 'uuid',
        countryTransaction: 'Argentina',
        message: 'Transferencia de prueba',
        createdBy: 'fernandeezalan20@gmail.com',
        senderAccount: {},
        receiverAccount: {},
        amount: {},
        proofOfPayment: {},
        createdAt: '2024-01-01T00:00:00Z',
        finalStatus: 'pending',
      },
    },
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
      parsedDto = JSON.parse(body.createTransactionDto) as Partial<CreateTransactionDto>;
    } catch {
      throw new BadRequestException('El campo createTransactionDto debe ser un JSON válido');
    }

    const createTransactionDto = plainToInstance(CreateTransactionDto, parsedDto);

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

    return await this.transactionsService.create(createTransactionDto, fileData);
  }

  // Obtener historial de estados (público)
  @Get('status/:id')
  @ApiOperation({ summary: 'Obtener historial público de una transacción' })
  @ApiQuery({ name: 'lastName', required: true, type: String })
  @ApiResponse({
    status: 200,
    description: 'Historial de estados obtenido correctamente',
    type: UserStatusHistoryResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'El apellido no coincide con el remitente de la transacción.',
  })
  @ApiResponse({
    status: 404,
    description: 'Transacción no encontrada o sin historial disponible.',
  })
  async getPublicStatusHistory(
    @Param('id') id: string,
    @Query('lastName') lastName: string,
  ): Promise<UserStatusHistoryResponseDto> {
    const history = await this.transactionsService.getPublicStatusHistory(id, lastName);
    return {
      success: true,
      message: 'Historial obtenido correctamente',
      data: history,
    };
  }

  // Obtener todas las transacciones (uso interno/admin)
  @Get()
  @ApiOperation({ summary: 'Obtener todas las transacciones' })
  @ApiResponse({
    status: 200,
    description: 'Lista de transacciones',
    schema: {
      example: [
        {
          id: 'uuid',
          countryTransaction: 'Argentina',
          message: 'Transferencia de prueba',
          createdBy: 'fernandeezalan20@gmail.com',
          senderAccount: {},
          receiverAccount: {},
          amount: {},
          proofOfPayment: {},
          createdAt: '2024-01-01T00:00:00Z',
          finalStatus: 'pending',
        },
      ],
    },
  })
  findAll() {
    return this.transactionsService.findAll();
  }

  // Obtener transacción por ID con autorización
  @Get(':transaction_id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('user')
  @ApiOperation({
    summary: 'Obtiene una transacción específica por su ID verificando el email del usuario',
  })
  @ApiResponse({
    status: 200,
    description: 'La transacción fue encontrada y el usuario tiene acceso',
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
    return this.transactionsService.getTransactionByEmail(transactionId, userEmail);
  }
}
