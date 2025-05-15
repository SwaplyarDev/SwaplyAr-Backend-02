import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { AdminUserService } from './admin-user.service';
import { CreateAdminUserDto } from '../dto/admin-user/create-admin-user.dto';
import { UpdateAdminUserDto } from '../dto/admin-user/update-admin-user.dto';

@Controller('admin/admin-user')
export class AdminUserController {
  constructor(private readonly adminUserService: AdminUserService) {}

  @Post()
  create(@Body() dto: CreateAdminUserDto) {
    return this.adminUserService.create(dto);
  }

  @Get()
  findAll() {
    return this.adminUserService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.adminUserService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() dto: UpdateAdminUserDto) {
    return this.adminUserService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.adminUserService.remove(id);
  }
} 