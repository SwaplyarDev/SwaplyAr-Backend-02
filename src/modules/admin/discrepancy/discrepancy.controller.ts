import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { DiscrepancyService } from './discrepancy.service';
import { CreateDiscrepancyDto } from '../dto/discrepancy/create-discrepancy.dto';
import { UpdateDiscrepancyDto } from '../dto/discrepancy/update-discrepancy.dto';

@Controller('admin/discrepancy')
export class DiscrepancyController {
  constructor(private readonly discrepancyService: DiscrepancyService) {}

  @Post()
  create(@Body() dto: CreateDiscrepancyDto) {
    return this.discrepancyService.create(dto);
  }

  @Get()
  findAll() {
    return this.discrepancyService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.discrepancyService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() dto: UpdateDiscrepancyDto) {
    return this.discrepancyService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.discrepancyService.remove(id);
  }
} 