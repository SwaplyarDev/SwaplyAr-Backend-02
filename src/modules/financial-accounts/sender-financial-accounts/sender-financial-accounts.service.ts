import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSenderFinancialAccountDto } from './dto/create-sender-financial-account.dto';
import { SenderFinancialAccount } from './entities/sender-financial-account.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PaymentMethodService } from '@financial-accounts/payment-methods/payment-method.service';
import { UpdateSenderFinancialAccountDto } from './dto/update-sender-financial-account.dto';

@Injectable()
export class SenderFinancialAccountsService {
  constructor(
    @InjectRepository(SenderFinancialAccount)
    private readonly senderRepository: Repository<SenderFinancialAccount>,
    private readonly paymentMethodService: PaymentMethodService,
  ) {}

  async create(createSenderFinancialAccountDto: CreateSenderFinancialAccountDto) {
  const { paymentMethod } = createSenderFinancialAccountDto;

  const newPaymentMethod = await this.paymentMethodService.create(paymentMethod, true);

  const data = this.senderRepository.create({
    ...createSenderFinancialAccountDto,
    paymentMethod: newPaymentMethod,
  });

  const savedSender = await this.senderRepository.save(data);

  return savedSender;
}

  async findAll() {
    return await this.senderRepository.find({
      relations: { paymentMethod: true },
    });
  }

  async findOne(id: string) {
    return await this.senderRepository.findOne({ where: { id } });
  }

  async findById(id: string) {
    return this.senderRepository.findOne({
      where: { id },
      relations: ['paymentMethod'], // si estás usando relaciones
    });
  }

  async update(id: string, dto: UpdateSenderFinancialAccountDto) {
    const senderAccount = await this.senderRepository.findOne({
      where: { id },
      relations: ['paymentMethod'],
    });

    if (!senderAccount) {
      throw new NotFoundException(`Sender account with ID ${id} not found`);
    }

    // Actualiza campos básicos
    if (dto.firstName) senderAccount.firstName = dto.firstName;
    if (dto.lastName) senderAccount.lastName = dto.lastName;

    // Actualiza el paymentMethod (si se envía)
    if (dto.paymentMethod) {
      Object.assign(senderAccount.paymentMethod, dto.paymentMethod);
    }

    return await this.senderRepository.save(senderAccount);
  }

  async delete(id: string): Promise<boolean> {
    const account = await this.senderRepository.findOne({ where: { id } });
    if (!account) return false;

    await this.senderRepository.delete(id);
    return true;
  }
}
