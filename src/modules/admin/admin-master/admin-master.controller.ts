import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { AdminMasterService } from './admin-master.service';
import { CreateAdminMasterDto } from '../dto/admin-master/create-admin-master.dto';
import { UpdateAdminMasterDto } from '../dto/admin-master/update-admin-master.dto';

@Controller('admin/admin-master')
export class AdminMasterController {
  constructor(private readonly adminMasterService: AdminMasterService) {}

  @Post()
  create(@Body() dto: CreateAdminMasterDto) {
    return this.adminMasterService.create(dto);
  }

  @Get()
  findAll() {
    return this.adminMasterService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.adminMasterService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() dto: UpdateAdminMasterDto) {
    return this.adminMasterService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.adminMasterService.remove(id);
  }
} 