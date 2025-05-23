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
  Logger,
  ValidationPipe,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { AddVoucherDto } from './dto/add-voucher.dto';
import { FilterTransactionsDto } from './dto/filter-transactions.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { JwtAuthGuard } from '../../common/jwt-auth.guard';
import { User } from '../../common/user.decorator';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { UpdateReceiverDto } from './dto/update-receiver.dto';

@Controller('admin')
@UseGuards(JwtAuthGuard)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  /* -------------------------------------------------------------------------- */
  /*                              LISTA GENERAL    (listo)                             */
  /* -------------------------------------------------------------------------- */
  @Get('transactions')
  async getAllTransactions(
    @Query('page') page: string,
    @Query('perPage') perPage: string,
    @Query() query: any,
    @User() user: any,
  ) {
    const userEmail = user.role === 'admin' || user.role === 'super_admin' ? null : user.email;
    const dynamicFilters = { ...query };
    delete dynamicFilters.page;
    delete dynamicFilters.perPage;
    return this.adminService.findAllTransactionsPaginated(
      userEmail,
      page ? parseInt(page) : 1,
      perPage ? parseInt(perPage) : 6,
      dynamicFilters
    );
  }

  /* -------------------------------------------------------------------------- */
  /*                       CARGAR COMPROBANTE (FILE)  (listo)                          */
  /* -------------------------------------------------------------------------- */
  @Post('transactions/voucher')
  @UseInterceptors(FileInterceptor('comprobante'))
  async addVoucher(
    @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true })) body: AddVoucherDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    try {
      return await this.adminService.addTransactionReceipt(
        body.transactionId,
        file,
        body.comprobante,
      );
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Error interno al agregar comprobante',
      };
    }
  }

  /* -------------------------------------------------------------------------- */
  /*                           STATUS HISTORY       (listo)                           */
  /* -------------------------------------------------------------------------- */
  @Get('transactions/status/:id')
  async getStatusHistory(@Param('id') id: string) {
    try {
      const statusHistory = await this.adminService.getStatusHistory(id);
      return {
        success: true,
        message: 'Historial de estados obtenido correctamente',
        data: statusHistory,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Error interno al obtener el historial de estados',
        details: error.stack,
      };
    }
  }

  /* -------------------------------------------------------------------------- */
  /*                         OBTENER TRANSACCIÓN        (falta)                        */
  /* -------------------------------------------------------------------------- */
  @Get('transactions/:id')
  async getTransaction(
    @Param('id') id: string,
    @User() user: any,
  ) {
    try {
      if (!id) {
        Logger.warn('Intento de obtener transacción sin ID.');
        return {
          success: false,
          message: 'El ID de la transacción es requerido.',
        };
      }
      const transaction = await this.adminService.getTransactionById(id);
      if (!transaction) {
        Logger.warn(`Transacción no encontrada con ID: ${id}`);
        return {
          success: false,
          message: 'Transacción no encontrada.',
        };
      }
      // Verificar autorización
      const userEmail = user.email;
      const userRole = user.role;
      const isAdmin = userRole === 'admin' || userRole === 'super_admin';
      // Buscar emails de sender y receiver
      const senderEmail = transaction.transaction?.senderAccount?.email;
      const receiverEmail = (transaction.transaction?.receiverAccount as any)?.email;
      const isOwner = senderEmail === userEmail || receiverEmail === userEmail;
      if (!isAdmin && !isOwner) {
        Logger.warn(`Acceso no autorizado a transacción ${id} por usuario ${userEmail}.`);
        return {
          success: false,
          message: 'Acceso no autorizado a esta transacción.',
        };
      }
      Logger.log(`Acceso autorizado a transacción ${id} por usuario ${userEmail} (Rol: ${userRole}).`);
      return {
        success: true,
        data: transaction,
      };
    } catch (error) {
      Logger.error(`Error en getTransaction al obtener transacción ${id}:`, error);
      return {
        success: false,
        message: 'Error interno al obtener la transacción',
        details: error.message,
      };
    }
  }
/* 
  /* -------------------------------------------------------------------------- */
  /*                         FILTRADAS + PAGINACIÓN        (falta)                        */
  /* -------------------------------------------------------------------------- */
/*   @Get('transactions/filtered')
  async getFiltered(@Query() query: FilterTransactionsDto) {
    return this.adminService.findFiltered({
      where: query.where ? JSON.parse(query.where) : undefined,
      take: query.take ? Number(query.take) : undefined,
      skip: query.skip ? Number(query.skip) : undefined,
    });
  }


  */
  /* -------------------------------------------------------------------------- */
  /*                UPDATE ADMIN TRANSACTION (PUT STATUS/:id)        ()                   */
  /* -------------------------------------------------------------------------- */
/*   @Put('transactions/status/:id')
  async updateAdminTransaction(@Param('id') id: string, @Body() body: any) {
    return this.adminService.updateAdminTransaction(id, body);
  }
 */
  /* -------------------------------------------------------------------------- */
  /*                CAMBIAR ESTADO POR TIPO (POST STATUS/:status)        (listo)               */
  /* -------------------------------------------------------------------------- */
  @Post('transactions/status/:status')
  async updateStatusByType(
    @Param('status') status: string,
    @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true })) body: UpdateStatusDto & any,
  ) {
    try {
      const transactionId = body.transactionId;
      if (!transactionId) {
        return {
          success: false,
          message: 'Se requiere el ID de la transacción',
        };
      }
      const validStatus = [
        'pending',
        'review_payment',
        'approved',
        'rejected',
        'refund_in_transit',
        'in_transit',
        'discrepancy',
        'canceled',
        'modified',
        'refunded',
        'completed',
      ];
      if (!validStatus.includes(status)) {
        return {
          success: false,
          message: `Estado no válido. Debe ser uno de: ${validStatus.join(', ')}`,
        };
      }
      // Lógica adicional según el status
      let additionalInfo = {};
      switch (status) {
        case 'review_payment':
          if (!body.review) {
            return {
              success: false,
              message: 'Se requiere código de transferencia para el estado review_payment',
            };
          }
          additionalInfo = { transferReceived: body.review };
          break;
        case 'discrepancy':
          if (!body.descripcion) {
            return {
              success: false,
              message: 'Se requiere descripción de la discrepancia',
            };
          }
          additionalInfo = { discrepancyInfo: { cause: body.descripcion, result: '' } };
          break;
        case 'canceled':
          if (!body.descripcion) {
            return {
              success: false,
              message: 'Se requiere motivo de cancelación',
            };
          }
          additionalInfo = { cancelledInfo: { cause: body.descripcion, reasonNote: body.descripcion } };
          break;
        case 'modified':
          if (!body.descripcion) {
            return {
              success: false,
              message: 'Se requiere descripción de la modificación',
            };
          }
          additionalInfo = { discrepancyInfo: { cause: 'Modificación solicitada', result: body.descripcion } };
          break;
        case 'refunded':
          if (!body.codigo_transferencia) {
            return {
              success: false,
              message: 'Se requiere código de transferencia de reembolso',
            };
          }
          additionalInfo = { approvedInfo: { transactionReceipt: body.codigo_transferencia, approvedNote: 'Reembolso realizado' } };
          break;
        default:
          break;
      }
      const result = await this.adminService.updateTransactionStatusByType(
        transactionId,
        status,
        additionalInfo,
      );
      return {
        success: true,
        message: `Estado actualizado a ${status} correctamente`,
        data: result,
      };
    } catch (error) {
      Logger.error(`Error al actualizar estado a ${status}:`, error);
      return {
        success: false,
        message: 'Error interno al actualizar el estado de la transacción',
        details: error.message,
      };
    }
  }

  /* -------------------------------------------------------------------------- */
  /*                         ACTUALIZAR RECEIVER        (falta)                                */
  /* -------------------------------------------------------------------------- */
  @Put('transactions/:id/receiver')
  async updateReceiver(
    @Param('id') id: string,
    @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true })) body: UpdateReceiverDto,
  ) {
    try {
      const { bank_name, sender_method_value, document_value } = body;
      if (!bank_name && !sender_method_value && !document_value) {
        return {
          success: false,
          message: 'Debes enviar al menos uno de los campos: bank_name, sender_method_value o document_value',
        };
      }
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
    } catch (err) {
      Logger.error('Error in updateReceiver:', err);
      return {
        success: false,
        message: 'Error interno al actualizar el receiver',
        details: err.message,
      };
    }
  }

  /* -------------------------------------------------------------------------- */
  /*                           ACTUALIZAR TX        (listo)                                    */
  /* -------------------------------------------------------------------------- */
  @Put('transactions/:id')
  async updateTransaction(
    @Param('id') id: string,
    @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true })) body: UpdateTransactionDto,
  ) {
    try {
      if (!body || Object.keys(body).length === 0) {
        return {
          success: false,
          message: 'No data provided to update the transaction',
        };
      }
      const result = await this.adminService.updateTransaction(id, body);
      return {
        success: true,
        message: 'Transacción actualizada correctamente',
        data: result,
      };
    } catch (err) {
      return {
        success: false,
        message: 'Error interno al actualizar la transacción',
        details: err.message,
      };
    }
  }
}
