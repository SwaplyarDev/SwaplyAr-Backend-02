import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ProofOfPaymentsService } from './proof-of-payments.service';
import { CreateProofOfPaymentDto } from './dto/create-proof-of-payment.dto';
import { UpdateProofOfPaymentDto } from './dto/update-proof-of-payment.dto';

@Controller('proof-of-payments')
export class ProofOfPaymentsController {
  constructor(private readonly proofOfPaymentsService: ProofOfPaymentsService) {}

  @Post()
  create(@Body() createProofOfPaymentDto: CreateProofOfPaymentDto) {
    return this.proofOfPaymentsService.create(createProofOfPaymentDto);
  }

  @Get()
  findAll() {
    return this.proofOfPaymentsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.proofOfPaymentsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProofOfPaymentDto: UpdateProofOfPaymentDto) {
    return this.proofOfPaymentsService.update(+id, updateProofOfPaymentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.proofOfPaymentsService.remove(+id);
  }
}
