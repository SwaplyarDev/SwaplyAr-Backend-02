import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AdminMasterService } from './admin-master.service';
import { CreateAdminMasterDto } from './dto/create-admin-master.dto';
import { UpdateAdminMasterDto } from './dto/update-admin-master.dto';

@Controller('admin')
export class AdminMasterController {
  constructor(private readonly adminMasterService: AdminMasterService) {}
  
  @Get('/transaction/info')
  getTransactionInfo() {
    return this.adminMasterService.getTransactionInfoService();
  }
  
  @Get('/transaction/info/:transactionId')
  getTransactionInfoById(@Param('id') id: string) {
    return this.adminMasterService.getTransactionInfoByIdService(id);
  }
  
  @Patch('/transaction/editar')
  updateTransactionAdmin(@Param('id') id: string, @Body() updateAdminMasterDto: UpdateAdminMasterDto) {
    return this.adminMasterService.updateTransactionAdminService(id, updateAdminMasterDto);
  }
  
  @Post('/transaction/status/:statusId')
  createTransactionStatus(@Body() createAdminMasterDto: CreateAdminMasterDto) {
    return this.adminMasterService.createTransactionStatusService(createAdminMasterDto);
  }

  @Get('/admin-transaction/status')
  getTransactionStatus() {
    return this.adminMasterService.getTransactionStatusService();
  }

   @Post('/transactions/voucher')
  createVoucher(@Body() createAdminMasterDto: CreateAdminMasterDto) {
    return this.adminMasterService.createVoucherService(createAdminMasterDto);
  }

}
