import {
  Body,
  Controller,
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
  NotFoundException,
} from '@nestjs/common';

import {
  ApiOperation,
  ApiTags,
  ApiBody,
  ApiParam,
  ApiBearerAuth,
  ApiConsumes,
  ApiQuery,
  ApiOkResponse,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiCreatedResponse,
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger';
import { StatusHistoryResponse } from 'src/common/interfaces/status-history.interface';
import { JwtAuthGuard } from '@common/jwt-auth.guard';
import { AdminRoleGuard } from '@common/guards/admin-role.guard';
import { MailerService } from '@mailer/mailer.service';
import {
  TransactionAdminResponseDto,
  TransactionByIdAdminResponseDto,
} from './dto/get-transaction-response.dto';
import { AdminTransactionService } from './admin-transaction.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Status } from 'src/enum/status.enum';
import {
  UpdateStatusByIdDto,
  UpdateStatusByTypeDto,
  UpdateStatusDto,
  UpdateTransactionRecipientDto,
} from './dto/update-status.dto';
import { User } from '@users/entities/user.entity';
import { UpdateTransactionPayloadDto } from './dto/update_transaction.dto';
import { AddVoucherTransactionDto } from './dto/add-voucher-to-transaction.dto';
import { TransactionStatesResponseDto } from './dto/get-transaction-states-response.dto';
import { TransactionsStatesResponseDto } from './dto/get-transactions-states-response.dto';

@ApiTags('Transacciones (Admin)')
@ApiBearerAuth()
@Controller('admin')
@UseGuards(JwtAuthGuard, AdminRoleGuard)
export class AdminTransactionController {
  constructor(
    private readonly adminService: AdminTransactionService,
    private readonly mailerService: MailerService,
  ) {}

  @ApiOperation({ summary: 'Obtener todas las transacciones' })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Número de página (por defecto 1)',
  })
  @ApiQuery({
    name: 'perPage',
    required: false,
    type: Number,
    description: 'Cantidad de elementos por página (por defecto 10)',
  })
  @ApiQuery({
    name: 'country',
    required: false,
    type: String,
    description: 'Filtra por país de la transacción (por ejemplo: Argentina, Brasil)',
  })
  @ApiQuery({
    name: 'status',
    required: false,
    type: String,
    description: 'Filtra por estado final de la transacción (pending, completed, failed, etc.)',
  })
  @ApiQuery({
    name: 'method',
    required: false,
    type: String,
    description: 'Filtra por método de pago (por ejemplo: bank, pix, paypal)',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    type: String,
    description: 'Busca texto en el mensaje o en el nombre del usuario',
  })
  @ApiOkResponse({
    description: 'Transacciones obtenidas correctamente',
    type: TransactionAdminResponseDto,
  })
  @ApiUnauthorizedResponse({ description: '❌ No autorizado. Token no válido o no enviado.' })
  @ApiForbiddenResponse({ description: '❌ Acceso no autorizado, Solo para Administradores' })
  @ApiNotFoundResponse({ description: '❌ No se encuentran Transacciones' })
  @ApiInternalServerErrorResponse({ description: '❌ Error interno del servidor' })
  @Get('transactions')
  async getAllTransactions(
    @Query('page') page = 1,
    @Query('perPage') perPage = 10,
    @Query('country') country?: string,
    @Query('status') status?: string,
    @Query('method') method?: string,
    @Query('search') search?: string,
  ): Promise<{ meta: any; data: TransactionAdminResponseDto[] }> {
    return this.adminService.findAllTransactions({
      page: Number(page),
      perPage: Number(perPage),
      country,
      status,
      method,
      search,
    });
  }

  @ApiOperation({ summary: 'Agregar comprobante a una transacción' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: AddVoucherTransactionDto })
  @ApiCreatedResponse({ description: 'Comprobante agregado correctamente' })
  @ApiBadRequestResponse({ description: 'Datos inválidos' })
  @Post('transactions/voucher')
  @UseInterceptors(FileInterceptor('comprobante'))
  async addVoucher(
    @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
    body: AddVoucherTransactionDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.adminService.addTransactionReceipt(body.transactionId, file);
  }

  @Get('transactions/status/:id')
  @ApiOperation({ summary: 'Obtener historial de estados de una transacción' })
  @ApiOkResponse({
    description: 'Historial de estados obtenido correctamente',
    type: TransactionStatesResponseDto,
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
  @ApiOkResponse({
    description: 'Historial de estados obtenido correctamente',
    type: TransactionsStatesResponseDto,
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
  @ApiOkResponse({ description: 'Estado actualizado correctamente' })
  @ApiBody({ type: UpdateStatusByIdDto })
  async updateTransactionStatus(
    @Param('id') id: string,
    @Body('status') status: Status,
    @Body('message') message: string,
    @Body('additionalData') additionalData: Record<string, any>,
    @Request() req: { user: User },
  ) {
    const result = await this.adminService.updateTransactionStatusByType(
      id,
      status,
      req.user,
      message,
      additionalData,
    );

    const transaction = await this.adminService.getTransactionById(id);

    if (transaction && transaction.senderAccount) {
      await this.mailerService.sendStatusEmail(transaction, status);
    }

    return result;
  }

  @ApiOperation({ summary: 'Obtener una transacción por ID' })
  @ApiOkResponse({
    description: 'Transacción encontrada',
    type: TransactionByIdAdminResponseDto,
  })
  @ApiUnauthorizedResponse({ description: '❌ No autorizado. Token no válido o no enviado.' })
  @ApiForbiddenResponse({ description: '❌ Acceso no autorizado, Solo para Administradores' })
  @ApiNotFoundResponse({ description: '❌ Transaccion no Encontrada' })
  @ApiInternalServerErrorResponse({ description: '❌ Error interno del servidor' })
  @ApiParam({
    name: 'id',
    description: 'ID de la transacción',
    example: 'uuid',
  })
  @Get('transactions/:id')
  async getTransaction(
    @Param('id') id: string,
  ): Promise<{ data?: TransactionByIdAdminResponseDto; message?: string }> {
    try {
      if (!id) {
        return {
          message: 'El ID de la transacción es requerido.',
        };
      }

      const transaction = await this.adminService.getTransactionById(id);

      return {
        data: this.adminService.formatTransaction(transaction),
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        return {
          message: 'Transacción no encontrada.',
        };
      }
      throw error;
    }
  }

  @ApiOperation({ summary: 'Obtener transacciones por createdBy (email) del remitente' })
  @ApiOkResponse({
    description: 'Transacciones encontradas',
    type: [TransactionByIdAdminResponseDto],
  })
  @ApiNotFoundResponse({ description: '❌ No se encontraron transacciones con ese email' })
  @Get('transactions/sender/:email')
  async getTransactionsByCreatedBy(
    @Param('email') email: string,
  ): Promise<{ data?: TransactionByIdAdminResponseDto[]; message?: string }> {
    try {
      if (!email) {
        return { message: 'El email (createdBy) es requerido.' };
      }

      const transactions = await this.adminService.getTransactionsByCreatedBy(email);

      return {
        data: transactions.map((tx) => this.adminService.formatTransaction(tx)),
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        return { message: 'No se encontraron transacciones con ese email.' };
      }
      throw error;
    }
  }

  @ApiOperation({ summary: 'Actualizar el estado de una transacción por tipo' })
  @ApiOkResponse({
    description: 'Estado actualizado correctamente',
    type: UpdateStatusByTypeDto,
  })
  @ApiBadRequestResponse({ description: 'Se requiere el ID de la transacción' })
  @ApiParam({
    name: 'status',
    description: 'Nuevo estado',
    example: 'approved',
  })
  @ApiBody({
    description: 'Datos para actualizar el estado',
    type: UpdateStatusDto,
  })
  @Post('transactions/status/:status')
  async updateStatusByType(
    @Param('status') status: Status,
    @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
    body: UpdateStatusDto & any,
    @Request() req: { user: User },
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

  @ApiOperation({ summary: 'Actualizar una transacción' })
  @ApiOkResponse({
    description: 'Transacción actualizada correctamente',
    type: UpdateTransactionRecipientDto,
  })
  @ApiParam({
    name: 'id',
    description: 'ID de la transacción',
    example: 'uuid',
  })
  @ApiBody({
    description: 'Datos para actualizar la transacción',
    type: UpdateTransactionPayloadDto,
  })
  @Put('transactions/:id')
  async updateTransaction(
    @Param('id') id: string,
    @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
    body: UpdateTransactionPayloadDto,
  ) {
    const result = await this.adminService.updateTransaction(id, body);
    return {
      success: true,
      message: 'Transacción actualizada correctamente',
      data: result,
    };
  }
}
