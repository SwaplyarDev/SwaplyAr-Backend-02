import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { ApprovedService } from './approved.service';
import { CreateApprovedDto } from '../dto/approved/create-approved.dto';
import { UpdateApprovedDto } from '../dto/approved/update-approved.dto';

@Controller('admin/approved')
export class ApprovedController {
  constructor(private readonly approvedService: ApprovedService) {}

  @Post()
  create(@Body() dto: CreateApprovedDto) {
    return this.approvedService.create(dto);
  }

  @Get()
  findAll() {
    return this.approvedService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.approvedService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() dto: UpdateApprovedDto) {
    return this.approvedService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.approvedService.remove(id);
  }
} 