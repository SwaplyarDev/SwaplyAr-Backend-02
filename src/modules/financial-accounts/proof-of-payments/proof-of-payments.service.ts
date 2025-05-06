import { Injectable } from '@nestjs/common';
import { CreateProofOfPaymentDto } from './dto/create-proof-of-payment.dto';
import { UpdateProofOfPaymentDto } from './dto/update-proof-of-payment.dto';

@Injectable()
export class ProofOfPaymentsService {
  create(createProofOfPaymentDto: CreateProofOfPaymentDto) {
    return 'This action adds a new proofOfPayment';
  }

  findAll() {
    return `This action returns all proofOfPayments`;
  }

  findOne(id: number) {
    return `This action returns a #${id} proofOfPayment`;
  }

  update(id: number, updateProofOfPaymentDto: UpdateProofOfPaymentDto) {
    return `This action updates a #${id} proofOfPayment`;
  }

  remove(id: number) {
    return `This action removes a #${id} proofOfPayment`;
  }
}
