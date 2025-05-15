import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { RejectedService } from './rejected.service';
import { CreateRejectedDto } from '../dto/rejected/create-rejected.dto';
import { UpdateRejectedDto } from '../dto/rejected/update-rejected.dto';

@Controller('admin/rejected')
export class RejectedController {
  constructor(private readonly rejectedService: RejectedService) {}

  @Post()
  create(@Body() dto: CreateRejectedDto) {
    return this.rejectedService.create(dto);
  }

  @Get()
  findAll() {
    return this.rejectedService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.rejectedService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() dto: UpdateRejectedDto) {
    return this.rejectedService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.rejectedService.remove(id);
  }
} 