import { Injectable } from '@nestjs/common';
import { CreateTransactionDetailDto } from './dto/create-transaction-detail.dto';
import { UpdateTransactionDetailDto } from './dto/update-transaction-detail.dto';

@Injectable()
export class TransactionDetailsService {
  create(createTransactionDetailDto: CreateTransactionDetailDto) {
    return 'This action adds a new transactionDetail';
  }

  findAll() {
    return `This action returns all transactionDetails`;
  }

  findOne(id: number) {
    return `This action returns a #${id} transactionDetail`;
  }

  update(id: number, updateTransactionDetailDto: UpdateTransactionDetailDto) {
    return `This action updates a #${id} transactionDetail`;
  }

  remove(id: number) {
    return `This action removes a #${id} transactionDetail`;
  }
}
