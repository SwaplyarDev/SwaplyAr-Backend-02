import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
  UseGuards,
  Request,
} from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { plainToInstance } from 'class-transformer';
import { FileUploadDTO } from '../file-upload/dto/file-upload.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiConsumes, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Transaction } from './entities/transaction.entity';

@ApiTags('Transacciones')
@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @ApiOperation({ summary: 'Crear una transacción con comprobante (opcional)' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Datos para crear una transacción. El campo createTransactionDto debe ser un string JSON con la estructura de CreateTransactionDto. El campo file es opcional.',
    schema: {
      type: 'object',
      properties: {
        createTransactionDto: {
          type: 'string',
          example: JSON.stringify({
            paymentsId: '123',
            countryTransaction: 'Argentina',
            message: 'Transferencia de prueba',
            createdBy: 'nahu.davila@gmail.com',
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
                    documentValue: '87654321'
                  }
                }
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
                    documentValue: '12345678'
                  }
                }
              }
            },
            amount: {
              amountSent: 1000,
              currencySent: 'ARS',
              amountReceived: 900,
              currencyReceived: 'BRL',
              received: false
            }
          })
        },
        file: {
          type: 'string',
          format: 'binary',
          description: 'Comprobante de la transacción (opcional)'
        }
      }
    }
  })
  @ApiResponse({ status: 201, description: 'Transacción creada correctamente', schema: {
    example: {
      id: 'uuid',
      countryTransaction: 'Argentina',
      message: 'Transferencia de prueba',
      createdBy: 'nahu.davila@gmail.com',
      senderAccount: { /* ... */ },
      receiverAccount: { /* ... */ },
      amount: { /* ... */ },
      proofOfPayment: { /* ... */ },
      createdAt: '2024-01-01T00:00:00Z',
      finalStatus: 'pending'
    }
  }})
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async create(@Body() body: any, @UploadedFile() file: Express.Multer.File) {
    //al enviar en formdata y enviar tantos campos como se requiere, el body llega como un string
    // por eso se hace el parseo
    const parsedDto = JSON.parse(body.createTransactionDto);

    // se crea una instancia de la clase createTransactionDto
    const createTransactionDto = plainToInstance(
      CreateTransactionDto,
      parsedDto,
    );

    // Si no se envía archivo, file será undefined
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

  @ApiOperation({ summary: 'Obtener todas las transacciones' })
  @ApiResponse({ status: 200, description: 'Lista de transacciones', schema: {
    example: [
      {
        id: 'uuid',
        countryTransaction: 'Argentina',
        message: 'Transferencia de prueba',
        createdBy: 'nahu.davila@gmail.com',
        senderAccount: { /* ... */ },
        receiverAccount: { /* ... */ },
        amount: { /* ... */ },
        proofOfPayment: { /* ... */ },
        createdAt: '2024-01-01T00:00:00Z',
        finalStatus: 'pending'
      }
    ]
  }})
  @Get()
  findAll() {
    return this.transactionsService.findAll();
  }

  @Get(':transaction_id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('user')
  @ApiOperation({ summary: 'Obtiene una transacción específica por su ID verificando el email del usuario' })
  @ApiResponse({
    status: 200,
    description: 'La transacción fue encontrada y el usuario tiene acceso',
    type: Transaction,
  })
  @ApiResponse({ status: 403, description: 'Acceso no autorizado a la transacción' })
  @ApiResponse({ status: 404, description: 'Transacción no encontrada' })
  async getTransactionByEmail(
    @Param('transaction_id') transactionId: string,
    @Request() req,
  ) {
    const userEmail = req.user.email;
    return this.transactionsService.getTransactionByEmail(transactionId, userEmail);
  }
}
