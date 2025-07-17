import { Controller, Get, Post, Param, Body } from '@nestjs/common';

import { CreateQualificationDto } from './dto/create-qualification.dto';
import { QualificationService } from './qualifications.service';

@Controller('qualifications')
export class QualificationController {
  constructor(private readonly qualificationService: QualificationService) {}

  @Get()
  findAll() {
    return this.qualificationService.findAll();
  }

  @Get(':id_transaction')
  findByTransactionId(@Param('id_transaction') id: string) {
    return this.qualificationService.findByTransactionId(id);
  }

  @Post()
  create(@Body() dto: CreateQualificationDto) {
    return this.qualificationService.create(dto);
  }
}
