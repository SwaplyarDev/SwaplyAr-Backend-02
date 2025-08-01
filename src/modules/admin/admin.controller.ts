import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UploadedFile,
  UseInterceptors,
  Query,
  UseGuards,
  ValidationPipe,
  Request,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { AddVoucherDto } from './dto/add-voucher.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { JwtAuthGuard } from '../../common/jwt-auth.guard';
import { User } from '../../common/user.decorator';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { AdminRoleGuard } from '../../common/guards/admin-role.guard';
import { AdminStatus } from '../../enum/admin-status.enum';
import { UpdateBankDto } from '@financial-accounts/payment-methods/bank/dto/create-bank.dto';
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiBody,
  ApiParam,
  ApiBearerAuth,
  ApiConsumes,
  ApiQuery,
} from '@nestjs/swagger';
import { User as UserEntity } from '@users/entities/user.entity';
import { StatusHistoryResponse } from 'src/common/interfaces/status-history.interface';
import { MailerService } from '../mailer/mailer.service';
import { Transaction } from 'typeorm';

@ApiTags('Admin')
@ApiBearerAuth()
@Controller('admin')
@UseGuards(JwtAuthGuard, AdminRoleGuard)
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly mailerService: MailerService,
  ) {}

  @ApiOperation({ summary: 'Obtener todas las transacciones' })
  @ApiResponse({
    status: 200,
    description: 'Transacciones obtenidas correctamente',
    schema: {
      example: {
        meta: {
          totalPages: 5,
          page: 1,
          perPage: 12,
          totalTransactions: 30,
        },
        data: [
          {
            id: 'uuid',
            status: 'pending',
          },
        ],
      },
    },
  })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiResponse({ status: 403, description: 'Prohibido' })
  @ApiResponse({ status: 404, description: 'No encontrado' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor' })
  @Get('transactions')
  async getAllTransactions(
    @Query('page') page: string,
    @Query('perPage') perPage: string,
    @Query() query: any,
    @User() user: any,
  ) {
    const dynamicFilters = { ...query };
    delete dynamicFilters.page;
    delete dynamicFilters.perPage;
    const userEmail =
      user.role === 'admin' || user.role === 'super_admin' ? null : user.email;
    return this.adminService.findAllTransactionsPaginated(
      userEmail,
      page ? parseInt(page) : 1,
      perPage ? parseInt(perPage) : 12,
      dynamicFilters,
    );
  }

  @ApiOperation({ summary: 'Agregar comprobante a una transacción' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description:
      'Sube un comprobante para una transacción. El `transactionId` es obligatorio y el `comprobante` es el archivo.',
    schema: {
      type: 'object',
      properties: {
        transactionId: {
          type: 'string',
          description:
            'ID de la transacción a la que se asocia el comprobante.',
        },
        comprobante: {
          type: 'string',
          format: 'binary',
          description: 'El archivo del comprobante (e.g., PDF, JPG).',
        },
      },
      required: ['transactionId', 'comprobante'],
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Comprobante agregado correctamente',
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @Post('transactions/voucher')
  @UseInterceptors(FileInterceptor('comprobante'))
  async addVoucher(
    @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
    body: AddVoucherDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.adminService.addTransactionReceipt(
      body.transactionId,
      file,
      body.comprobante,
    );
  }

  @Get('transactions/status/:id')
  @ApiOperation({ summary: 'Obtener historial de estados de una transacción' })
  @ApiResponse({
    status: 200,
    description: 'Historial de estados obtenido correctamente',
    schema: {
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string' },
        data: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              status: { type: 'string' },
              changedAt: { type: 'string', format: 'date-time' },
              message: { type: 'string' },
              changedByAdmin: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  name: { type: 'string' },
                },
              },
            },
          },
        },
      },
    },
  })
  async getStatusHistory(@Param('id') id: string): Promise<{
    success: boolean;
    message: string;
    data: StatusHistoryResponse[];
  }> {
    const statusHistory = await this.adminService.getStatusHistory(id);
    return {
      success: true,
      message: 'Historial de estados obtenido correctamente',
      data: statusHistory,
    };
  }

  @Get('transactions/status')
  @ApiOperation({
    summary: 'Obtener historial completo de estados de todas las transacciones',
  })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({
    status: 200,
    description: 'Historial de estados obtenido correctamente',
    schema: {
      properties: {
        data: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              status: { type: 'string' },
              changedAt: { type: 'string', format: 'date-time' },
              message: { type: 'string' },
              changedByAdmin: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  name: { type: 'string' },
                },
              },
            },
          },
        },
        meta: {
          type: 'object',
          properties: {
            total: { type: 'number' },
            page: { type: 'number' },
            limit: { type: 'number' },
            totalPages: { type: 'number' },
          },
        },
      },
    },
  })
  async getAllStatusHistory(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ): Promise<{
    data: StatusHistoryResponse[];
    meta: { total: number; page: number; limit: number; totalPages: number };
  }> {
    return await this.adminService.getAllStatusHistory(page, limit);
  }

  @Post('transactions/:id/status')
  @ApiOperation({ summary: 'Actualizar estado de una transacción' })
  @ApiResponse({
    status: 200,
    description: 'Estado actualizado correctamente',
  })
  async updateTransactionStatus(
    @Param('id') id: string,
    @Body('status') status: AdminStatus,
    @Body('message') message: string,
    @Body('additionalData') additionalData: Record<string, any>,
    @Request() req: { user: UserEntity },
  ) {
    const result = await this.adminService.updateTransactionStatusByType(
      id,
      status,
      req.user,
      message,
      additionalData,
    );

    // Obtener la transacción actualizada para tener acceso al createdBy
    const transaction = await this.adminService.getTransactionById(id);

    // Enviar correos electrónicos según el estado
    if (transaction && transaction.createdBy) {
      await this.mailerService.sendStatusEmail(transaction, status);
    }

    return result;
  }

  @ApiOperation({ summary: 'Obtener una transacción por ID' })
  @ApiResponse({ status: 200, description: 'Transacción encontrada' })
  @ApiResponse({ status: 404, description: 'Transacción no encontrada' })
  @ApiParam({
    name: 'id',
    description: 'ID de la transacción',
    example: 'uuid',
  })
  @Get('transactions/:id')
  async getTransaction(@Param('id') id: string, @User() user: any) {
    if (!id) {
      return {
        success: false,
        message: 'El ID de la transacción es requerido.',
      };
    }
    const transaction = await this.adminService.getTransactionById(id);
    if (!transaction) {
      return {
        success: false,
        message: 'Transacción no encontrada.',
      };
    }
    const userEmail = user.email;
    const userRole = user.role;
    const isAdmin = userRole === 'admin' || userRole === 'super_admin';
    const senderEmail = transaction.senderAccount?.email;
    const receiverEmail = (transaction.receiverAccount as any)?.email;
    const isOwner = senderEmail === userEmail || receiverEmail === userEmail;
    if (!isAdmin && !isOwner) {
      return {
        success: false,
        message: 'Acceso no autorizado a esta transacción.',
      };
    }

    const receiver = transaction.receiverAccount as any;
    if (!receiver) {
      throw new Error('No se encontró receiver asociado a la transacción.');
    }
    const paymentMethod = receiver.paymentMethod;
    if (!paymentMethod || paymentMethod.method !== 'bank') {
      throw new Error('No se encontró banco asociado al receiver.');
    }

    return {
      success: true,
      data: transaction,
    };
  }

  @ApiOperation({ summary: 'Actualizar el estado de una transacción por tipo' })
  @ApiResponse({
    status: 200,
    description: 'Estado actualizado correctamente',
    schema: {
      example: {
        success: true,
        message: 'Estado actualizado a approved correctamente',
        data: {},
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Se requiere el ID de la transacción',
  })
  @ApiParam({
    name: 'status',
    description: 'Nuevo estado',
    example: 'approved',
  })
  @ApiBody({
    description: 'Datos para actualizar el estado',
    type: UpdateStatusDto,
    examples: {
      ejemplo1: {
        summary: 'Ejemplo de request',
        value: {
          transactionId: 'uuid',
        },
      },
    },
  })
  @Post('transactions/status/:status')
  async updateStatusByType(
    @Param('status') status: AdminStatus,
    @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
    body: UpdateStatusDto & any,
    @Request() req: { user: UserEntity },
  ) {
    const transactionId = body.transactionId;
    if (!transactionId) {
      return {
        success: false,
        message: 'Se requiere el ID de la transacción',
      };
    }
    const result = await this.adminService.updateTransactionStatusByType(
      transactionId,
      status,
      req.user,
      body.message,
      body.additionalData,
    );
    return {
      success: true,
      message: `Estado actualizado a ${status} correctamente`,
      data: result,
    };
  }

  @ApiOperation({ summary: 'Actualizar datos del receptor de una transacción' })
  @ApiResponse({
    status: 200,
    description: 'Transacción actualizada correctamente',
    schema: {
      example: {
        success: true,
        message: 'Transacción actualizada correctamente',
        data: {},
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Transaction ID is required' })
  @ApiParam({
    name: 'id',
    description: 'ID de la transacción',
    example: 'uuid',
  })
  @ApiBody({
    description: 'Datos para actualizar el receptor',
    type: UpdateBankDto,
    examples: {
      ejemplo1: {
        summary: 'Ejemplo de request',
        value: {
          bankName: 'Banco Nacion',
          sendMethodValue: '1234567890123456789012',
          documentValue: '1234567890',
        },
      },
    },
  })
  @Put('transactions/:id/receiver')
  async updateReceiver(
    @Param('id') id: string,
    @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
    body: UpdateBankDto,
  ) {
    if (!id) {
      return {
        success: false,
        message: 'Transaction ID is required',
      };
    }
    const result = await this.adminService.updateReceiver(id, body);
    return {
      success: true,
      message: 'Transacción actualizada correctamente',
      data: result,
    };
  }

  @ApiOperation({ summary: 'Actualizar una transacción' })
  @ApiResponse({
    status: 200,
    description: 'Transacción actualizada correctamente',
    schema: {
      example: {
        success: true,
        message: 'Transacción actualizada correctamente',
        data: {},
      },
    },
  })
  @ApiParam({
    name: 'id',
    description: 'ID de la transacción',
    example: 'uuid',
  })
  @ApiBody({
    description: 'Datos para actualizar la transacción',
    type: UpdateTransactionDto,
    examples: {
      ejemplo1: {
        summary: 'Ejemplo de request',
        value: {
          countryTransaction: 'Argentina',
          message: 'Transferencia de prueba',
          createdBy: 'nahu.davila@gmail.com',
          financialAccounts: {
            senderAccount: {
              firstName: 'Juan',
              lastName: 'Pérez',
              email: 'juan@swaply.com',
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
          amount: {
            amountSent: 1000,
            currencySent: 'ARS',
            amountReceived: 900,
            currencyReceived: 'BRL',
            received: false,
          },
        },
      },
    },
  })
  @Put('transactions/:id')
  async updateTransaction(
    @Param('id') id: string,
    @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
    body: UpdateTransactionDto,
  ) {
    const result = await this.adminService.updateTransaction(id, body);
    return {
      success: true,
      message: 'Transacción actualizada correctamente',
      data: result,
    };
  }
}
