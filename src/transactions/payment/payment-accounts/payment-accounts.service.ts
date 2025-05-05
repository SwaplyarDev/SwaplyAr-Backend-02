import { Injectable } from '@nestjs/common';
import { CreatePaymentAccountDto } from './dto/create-payment-account.dto';
import { UpdatePaymentAccountDto } from './dto/update-payment-account.dto';

@Injectable()
export class PaymentAccountsService {
  create(createPaymentAccountDto: CreatePaymentAccountDto) {
    return 'This action adds a new paymentAccount';
  }

  findAll() {
    return `This action returns all paymentAccounts`;
  }

  findOne(id: number) {
    return `This action returns a #${id} paymentAccount`;
  }

  update(id: number, updatePaymentAccountDto: UpdatePaymentAccountDto) {
    return `This action updates a #${id} paymentAccount`;
  }

  remove(id: number) {
    return `This action removes a #${id} paymentAccount`;
  }
}
