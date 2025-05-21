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
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { AddVoucherDto } from './dto/add-voucher.dto';
import { FilterTransactionsDto } from './dto/filter-transactions.dto';
import { UpdateStatusDto } from './dto/update-status.dto';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  /* -------------------------------------------------------------------------- */
  /*                              LISTA GENERAL                                 */
  /* -------------------------------------------------------------------------- */
  @Get('transactions')
  async listTransactions() {
    return this.adminService.findAllTransactions();
  }

  /* -------------------------------------------------------------------------- */
  /*                       CARGAR COMPROBANTE (FILE)                            */
  /* -------------------------------------------------------------------------- */
  @Post('transactions/voucher')
  @UseInterceptors(FileInterceptor('comprobante'))
  async addVoucher(
    @Body() body: AddVoucherDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.adminService.addTransactionReceipt(body.transactionId, file);
  }

  /* -------------------------------------------------------------------------- */
  /*                           STATUS HISTORY                                   */
  /* -------------------------------------------------------------------------- */
  @Get('transactions/status/:id')
  async getStatusHistory(@Param('id') id: string) {
    return this.adminService.getStatusHistory(id);
  }

  /* -------------------------------------------------------------------------- */
  /*                         OBTENER TRANSACCIÓN                                */
  /* -------------------------------------------------------------------------- */
  @Get('transactions/:id')
  async getTransaction(@Param('id') id: string) {
    return this.adminService.getTransactionById(id);
  }

  /* -------------------------------------------------------------------------- */
  /*                         FILTRADAS + PAGINACIÓN                             */
  /* -------------------------------------------------------------------------- */
  @Get('transactions/filtered')
  async getFiltered(@Query() query: FilterTransactionsDto) {
    return this.adminService.findFiltered({
      where: query.where ? JSON.parse(query.where) : undefined,
      take: query.take ? Number(query.take) : undefined,
      skip: query.skip ? Number(query.skip) : undefined,
    });
  }

  /* -------------------------------------------------------------------------- */
  /*                UPDATE ADMIN TRANSACTION (PUT STATUS/:id)                   */
  /* -------------------------------------------------------------------------- */
  @Put('transactions/status/:id')
  async updateAdminTransaction(@Param('id') id: string, @Body() body: any) {
    return this.adminService.updateAdminTransaction(id, body);
  }

  /* -------------------------------------------------------------------------- */
  /*                CAMBIAR ESTADO POR TIPO (POST STATUS/:status)               */
  /* -------------------------------------------------------------------------- */
  @Post('transactions/status/:status')
  async updateStatusByType(
    @Param('status') status: string,
    @Body() body: UpdateStatusDto,
  ) {
    return this.adminService.updateTransactionStatusByType(
      body.transactionId,
      status,
    );
  }

  /* -------------------------------------------------------------------------- */
  /*                         ACTUALIZAR RECEIVER                                */
  /* -------------------------------------------------------------------------- */
  @Put('transactions/:id/receiver')
  async updateReceiver(@Param('id') id: string, @Body() body: any) {
    return this.adminService.updateReceiver(id, body);
  }

  /* -------------------------------------------------------------------------- */
  /*                           ACTUALIZAR TX                                    */
  /* -------------------------------------------------------------------------- */
  @Put('transactions/:id')
  async updateTransaction(@Param('id') id: string, @Body() body: any) {
    return this.adminService.updateTransaction(id, body);
  }
}
