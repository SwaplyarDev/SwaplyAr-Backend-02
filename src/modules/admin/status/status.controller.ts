import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { StatusService } from './status.service';
import { CreateStatusDto } from '../dto/status/create-status.dto';
import { UpdateStatusDto } from '../dto/status/update-status.dto';

@Controller('admin/status')
export class StatusController {
  constructor(private readonly statusService: StatusService) {}

  @Post()
  create(@Body() dto: CreateStatusDto) {
    return this.statusService.create(dto);
  }

  @Get()
  findAll() {
    return this.statusService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.statusService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() dto: UpdateStatusDto) {
    return this.statusService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.statusService.remove(id);
  }
} 