import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateReceiverFinancialAccountDto } from './dto/create-receiver-financial-account.dto';
import { ReceiverFinancialAccount } from './entities/receiver-financial-account.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PaymentMethodService } from '@financial-accounts/payment-methods/payment-method.service';
import { UpdateReceiverFinancialAccountDto } from './dto/update-receiver-financial-account.dto';

@Injectable()
export class ReceiverFinancialAccountsService {
  constructor(
    @InjectRepository(ReceiverFinancialAccount)
    private readonly receiverRepository: Repository<ReceiverFinancialAccount>,
    private readonly paymentMethodService: PaymentMethodService,
  ) {}

  async create(createReceiverFinancialAccountDto: CreateReceiverFinancialAccountDto) {
    const { paymentMethod } = createReceiverFinancialAccountDto;

    const newPaymentMethod = await this.paymentMethodService.create(paymentMethod);
    console.log('Nuevo método de pago creado:', newPaymentMethod);

    // Crear el objeto base, pero asegurando que firstName y lastName tengan valor
    const data = this.receiverRepository.create({
      ...createReceiverFinancialAccountDto,
      paymentMethod: newPaymentMethod,
      firstName: createReceiverFinancialAccountDto.firstName ?? '', // si no viene, vacío
      lastName: createReceiverFinancialAccountDto.lastName ?? '', // si no viene, vacío
    });

    return await this.receiverRepository.save(data);
  }

  async findAll() {
    return await this.receiverRepository.find({
      relations: { paymentMethod: true },
    }); // lo guarda en la tabla financial accounts
  }

  async findOne(id: string) {
    return await this.receiverRepository.findOne({ where: { id } }); // lo guarda en la tabla financial accounts
  }

  async findById(id: string) {
    return this.receiverRepository.findOne({
      where: { id },
      relations: ['paymentMethod'], // si estás usando relaciones
    });
  }

  async update(id: string, dto: UpdateReceiverFinancialAccountDto) {
    const senderAccount = await this.receiverRepository.findOne({
      where: { id },
      relations: ['paymentMethod'],
    });

    if (!senderAccount) {
      throw new NotFoundException(`Sender account with ID ${id} not found`);
    }

    // Actualiza el paymentMethod (si se envía)
    if (dto.paymentMethod) {
      Object.assign(senderAccount.paymentMethod, dto.paymentMethod);
    }

    return await this.receiverRepository.save(senderAccount);
  }

  async delete(id: string): Promise<boolean> {
    const account = await this.receiverRepository.findOne({ where: { id } });
    if (!account) return false;

    await this.receiverRepository.delete(id);
    return true;
  }

  async addBankToReceiver(receiverId: string, bankDto: any, platformId: any) {
    const receiver = await this.receiverRepository.findOne({
      where: { id: receiverId },
      relations: { paymentMethod: true },
    });
    if (!receiver) throw new Error('Receiver not found');
    const newBank = await this.paymentMethodService.create({
      bank: bankDto,
      method: 'bank',
      platformId,
    });
    receiver.paymentMethod = newBank;
    return await this.receiverRepository.save(receiver);
  }
}
