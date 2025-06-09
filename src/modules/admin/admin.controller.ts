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
import { AdminRoleGuard } from '../../common/guards/admin-role.guard';
import { AdminStatus } from './entities/admin-status.enum';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  //funciona
  @Get('transactions')
  @UseGuards(JwtAuthGuard, AdminRoleGuard)
  async getAllTransactions(
    @Query('page') page: string,
    @Query('perPage') perPage: string,
    @Query() query: any,
    @User() user: any,
  ) {
    const dynamicFilters = { ...query };
    delete dynamicFilters.page;
    delete dynamicFilters.perPage;
    const userEmail = user.role === 'admin' || user.role === 'super_admin' ? null : user.email;
    return this.adminService.findAllTransactionsPaginated(
      userEmail,
      page ? parseInt(page) : 1,
      perPage ? parseInt(perPage) : 6,
      dynamicFilters
    );
  }

  //funciona
  @Post('transactions/voucher')
  @UseGuards(JwtAuthGuard, AdminRoleGuard)
  @UseInterceptors(FileInterceptor('comprobante'))
  async addVoucher(
    @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true })) body: AddVoucherDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.adminService.addTransactionReceipt(
      body.transactionId,
      file,
      body.comprobante,
    );
  }


  @Get('transactions/status/:id')
  @UseGuards(JwtAuthGuard, AdminRoleGuard)
  async getStatusHistory(@Param('id') id: string) {
    const statusHistory = await this.adminService.getStatusHistory(id);
    return {
      success: true,
      message: 'Historial de estados obtenido correctamente',
      data: statusHistory,
    };
  }

  @Get('transactions/:id')
  @UseGuards(JwtAuthGuard, AdminRoleGuard)
  async getTransaction(
    @Param('id') id: string,
    @User() user: any,
  ) {
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
    // Verificar autorización
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
    return {
      success: true,
      data: transaction,
    };
  }

  @Post('transactions/status/:status')
  @UseGuards(JwtAuthGuard, AdminRoleGuard)
  async updateStatusByType(
    @Param('status') status: AdminStatus,
    @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true })) body: UpdateStatusDto & any,
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
      {}, 
    );
    return {
      success: true,
      message: `Estado actualizado a ${status} correctamente`,
      data: result,
    };
  }

  @Put('transactions/:id/receiver')
  @UseGuards(JwtAuthGuard, AdminRoleGuard)
  async updateReceiver(
    @Param('id') id: string,
    @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true })) body: UpdateReceiverDto,
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

  @Put('transactions/:id')
  @UseGuards(JwtAuthGuard, AdminRoleGuard)
  async updateTransaction(
    @Param('id') id: string,
    @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true })) body: UpdateTransactionDto,
  ) {
    const result = await this.adminService.updateTransaction(id, body);
    return {
      success: true,
      message: 'Transacción actualizada correctamente',
      data: result,
    };
  }
}
