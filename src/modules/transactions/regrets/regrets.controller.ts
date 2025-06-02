import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RegretsService } from './regrets.service';
import { CreateRegretDto } from './dto/create-regret.dto';
import { UpdateRegretDto } from './dto/update-regret.dto';

@Controller('regrets')
export class RegretsController {
  constructor(private readonly regretsService: RegretsService) {}

  @Post()
  create(@Body() createRegretDto: CreateRegretDto) {
    return this.regretsService.create(createRegretDto);
  }

  @Get()
  findAll() {
    return this.regretsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.regretsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRegretDto: UpdateRegretDto) {
    return this.regretsService.update(id, updateRegretDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.regretsService.remove(id);
  }
} 