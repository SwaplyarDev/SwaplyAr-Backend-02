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
  ForbiddenException,
  NotFoundException,
  InternalServerErrorException,
  DefaultValuePipe,
  ParseIntPipe,
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
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Transaction } from './entities/transaction.entity';
import {
  TransactionGetByIdDto,
  TransactionGetResponseDto,
  TransactionResponseDto,
} from './dto/transaction-response.dto';
import { UserStatusHistoryResponseDto } from './dto/user-status-history.dto';
import { JwtService } from '@nestjs/jwt';
import { validateOrReject } from 'class-validator';
import { IsPhoneNumberValid } from '@common/decorators/phone-number.decorator';

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

class PhoneNumberValidator {
  @IsPhoneNumberValid({
    message: 'Número inválido según su código de país. Use formato +<código_pais><numero>.',
  })
  phoneNumber: string;

  constructor(phoneNumber: string) {
    this.phoneNumber = phoneNumber;
  }
}

@ApiTags('Transacciones')
@Controller('transactions')
export class TransactionsController {
  constructor(
    private readonly transactionsService: TransactionsService,
    private readonly jwtService: JwtService,
  ) {}

  // POST /transactions - Crear transacción con comprobante
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
              countryTransaction: 'Argentina',
              message: 'Transferencia Crypto',
              financialAccounts: {
                senderAccount: {
                  firstName: 'Diego',
                  lastName: 'Fernández',
                  phoneNumber: '12456789',
                  createdBy: 'fernandeezalan20@gmail.com',
                  paymentMethod: { platformId: 'receiver_crypto', method: 'receiver-crypto' },
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
  async create(@Body() body: CreateTransactionBody, @UploadedFile() file: Express.Multer.File) {
    // Validación del body
    if (!body || !body.createTransactionDto) {
      throw new BadRequestException('El body o el campo createTransactionDto están vacíos');
    }

    // Validación de archivo obligatorio
    if (!file) {
      throw new BadRequestException('El archivo del comprobante es obligatorio');
    }

    // Parseo JSON con try/catch
    let parsedDto: Partial<CreateTransactionDto>;
    try {
      parsedDto = JSON.parse(body.createTransactionDto) as Partial<CreateTransactionDto>;
    } catch {
      throw new BadRequestException('El campo createTransactionDto debe ser un JSON válido');
    }

    // Validación de campos obligatorios del DTO
    const requiredFields: (keyof CreateTransactionDto)[] = [
      'countryTransaction',
      'financialAccounts',
      'amount',
    ];

    for (const field of requiredFields) {
      if (!parsedDto[field]) {
        throw new BadRequestException(`El campo ${field} es obligatorio`);
      }
    }

    // Convierte JSON → DTO
    const createTransactionDto = plainToInstance(CreateTransactionDto, parsedDto);

    const senderDto = createTransactionDto.financialAccounts.senderAccount;

    try {
      const phoneValidator = new PhoneNumberValidator(senderDto.phoneNumber);
      await validateOrReject(phoneValidator);
    } catch (errors: unknown) {
      // Extraer solo mensajes de error de forma segura
      const msgs: string[] = Array.isArray(errors)
        ? (errors as unknown[]).flatMap((err) => {
            if (
              err &&
              typeof err === 'object' &&
              'constraints' in err &&
              (err as Record<string, unknown>).constraints &&
              typeof (err as Record<string, unknown>).constraints === 'object'
            ) {
              return Object.values(
                (err as Record<string, unknown>).constraints as Record<string, string>,
              );
            }
            if (err instanceof Error) return [err.message];
            return ['Error de validación desconocido'];
          })
        : errors instanceof Error
          ? [errors.message]
          : ['Error de validación desconocido'];

      throw new BadRequestException({ message: 'Validation failed', errors: msgs });
    }

    // Construcción del fileData
    const fileData: FileUploadDTO = {
      buffer: file.buffer,
      fieldName: file.fieldname,
      mimeType: file.mimetype,
      originalName: file.originalname,
      size: file.size,
    };

    try {
      // Llamada al servicio
      return await this.transactionsService.create(createTransactionDto, fileData);
    } catch (error: unknown) {
      // Captura errores específicos de Postgres (ej.: NOT NULL violation 23502)
      let pgCode: string | undefined;
      if (typeof error === 'object' && error !== null && 'code' in error) {
        const codeVal = (error as Record<string, unknown>)['code'];
        if (typeof codeVal === 'string') pgCode = codeVal;
      }
      if (pgCode === '23502') {
        throw new BadRequestException('Faltan campos obligatorios para guardar la transacción');
      }
      throw new InternalServerErrorException('Error inesperado al crear la transacción');
    }
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
    description: '❌ El apellido no coincide con el remitente de la transacción.',
  })
  @ApiResponse({
    status: 404,
    description: '❌ Transacción no encontrada o sin historial disponible.',
  })
  async getPublicStatusHistory(
    @Param('id') id: string,
    @Query('lastName') lastName: string,
  ): Promise<any> {
    const history = await this.transactionsService.getPublicStatusHistory(id, lastName);
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
    description: '✅ Lista de transacciones o mensaje indicando que no hay transacciones',
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
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'pageSize', required: false, type: Number, example: 10 })
  async findAll(
    @Req() req: RequestWithUser,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('pageSize', new DefaultValuePipe(10), ParseIntPipe) pageSize: number,
  ): Promise<{
    data: TransactionGetResponseDto[];
    pagination: {
      page: number;
      pageSize: number;
      totalItems: number;
      totalPages: number;
    };
  }> {
    const email = req.user.email;

    return await this.transactionsService.findAllUserEmail(email, page, pageSize);
  }

  // Obtener transacción por ID con autorización
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('user')
  @ApiOperation({
    summary: 'Obtiene una transacción específica por su ID verificando el email del usuario',
    description:
      'Devuelve la transacción completa con sus relaciones (cuentas, método de pago, monto y comprobante), ' +
      'siempre que el usuario autenticado sea el creador de la cuenta emisora. ' +
      'Si la transacción no existe o el email no coincide, devuelve un error.',
  })
  @ApiResponse({
    status: 200,
    description: '✅ La transacción fue encontrada y el usuario tiene acceso',
    type: TransactionGetByIdDto,
  })
  @ApiUnauthorizedResponse({
    description: 'No autorizado. Token no válido o no enviado.',
  })
  @ApiResponse({
    status: 403,
    description: '❌ Acceso no autorizado a la transacción',
  })
  @ApiResponse({
    status: 404,
    description: '❌ Transacción no encontrada',
  })
  @ApiResponse({
    status: 500,
    description: '⚠️ Error interno del servidor',
  })
  @Get(':transaction_id')
  async getTransactionByEmail(
    @Param('transaction_id') transactionId: string,
    @Request() req: RequestWithUser,
  ): Promise<TransactionGetByIdDto> {
    const userEmail = req.user.email;

    try {
      const transaction: Transaction = await this.transactionsService.getTransactionByEmail(
        transactionId,
        userEmail,
      );

      // Convierte Transaction → TransactionGetByIdDto y elimina los nulls automáticamente
      const dto = plainToInstance(TransactionGetByIdDto, transaction, {
        excludeExtraneousValues: true, // Solo expone los campos con @Expose
      });

      return dto;
    } catch (error) {
      if (error instanceof ForbiddenException) {
        throw new ForbiddenException(error.message || 'Acceso no autorizado');
      }
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message || 'Transacción no encontrada');
      }
      throw new InternalServerErrorException('Error inesperado al obtener la transacción');
    }
  }
}
