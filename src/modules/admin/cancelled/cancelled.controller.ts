import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { CancelledService } from './cancelled.service';
import { CreateCancelledDto } from '../dto/cancelled/create-cancelled.dto';
import { UpdateCancelledDto } from '../dto/cancelled/update-cancelled.dto';

@Controller('admin/cancelled')
export class CancelledController {
  constructor(private readonly cancelledService: CancelledService) {}

  @Post()
  create(@Body() dto: CreateCancelledDto) {
    return this.cancelledService.create(dto);
  }

  @Get()
  findAll() {
    return this.cancelledService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.cancelledService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() dto: UpdateCancelledDto) {
    return this.cancelledService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.cancelledService.remove(id);
  }
} 