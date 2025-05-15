import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { LogService } from './log.service';
import { CreateLogDto } from '../dto/log/create-log.dto';
import { UpdateLogDto } from '../dto/log/update-log.dto';

@Controller('admin/log')
export class LogController {
  constructor(private readonly logService: LogService) {}

  @Post()
  create(@Body() dto: CreateLogDto) {
    return this.logService.create(dto);
  }

  @Get()
  findAll() {
    return this.logService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.logService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() dto: UpdateLogDto) {
    return this.logService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.logService.remove(id);
  }
} 