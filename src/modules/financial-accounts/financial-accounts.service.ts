import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateFinancialAccountDto } from './dto/create-financial-accounts.dto';
import { SenderFinancialAccountsService } from './sender-financial-accounts/sender-financial-accounts.service';
import { ReceiverFinancialAccountsService } from './receiver-financial-accounts/receiver-financial-accounts.service';
import { UpdateSenderFinancialAccountDto } from './sender-financial-accounts/dto/update-sender-financial-account.dto';
import { UpdateReceiverFinancialAccountDto } from './receiver-financial-accounts/dto/update-receiver-financial-account.dto';
import { CreatePaymentMethodDto } from './payment-methods/dto/create-payment-method.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { PaymentMethodService } from './payment-methods/payment-method.service';
import { FinancialAccount } from './entities/financial-account.entity';
import { Repository } from 'typeorm';

@Injectable()
export class FinancialAccountsService {
    constructor(
    private readonly senderService: SenderFinancialAccountsService,       
    private readonly receiverService: ReceiverFinancialAccountsService,  
    private readonly paymentMethodService: PaymentMethodService,         
    @InjectRepository(FinancialAccount)
    private readonly financialAccountRepo: Repository<FinancialAccount>, 
  ) {}

  async create(createFinancialAccountDto: CreateFinancialAccountDto) {
    const { senderAccount, receiverAccount } = createFinancialAccountDto;

    // Crear el receiver (igual puedes incluir email y phone si quieres)
    const receiver = await this.receiverService.create(receiverAccount);

    // Crear el sender, asegurándote de que se guarden email y phoneNumber
    const sender = await this.senderService.create(senderAccount);

    const { createdBy, phoneNumber, ...senderClean } = sender;

    return { sender: senderClean, receiver };
  }

async createSingleFinancialAccount(
  createPaymentMethodDto: CreatePaymentMethodDto,
  accountData: { firstName?: string; lastName?: string },
) {
  try {
    // 1️⃣ Crear PaymentMethod
    const paymentMethod = await this.paymentMethodService.create({
      platformId: createPaymentMethodDto.platformId,
      method: createPaymentMethodDto.method,
      bank: createPaymentMethodDto.bank,
      pix: createPaymentMethodDto.pix,
      type: createPaymentMethodDto.type,
      receiverCrypto: createPaymentMethodDto.receiverCrypto,
      virtualBank: createPaymentMethodDto.virtualBank,
});

    // 2️⃣ Crear FinancialAccount
    const financialAccount = this.financialAccountRepo.create({
      firstName: accountData.firstName,
      lastName: accountData.lastName,
      paymentMethod: paymentMethod,
    });

    const savedFinancialAccount = await this.financialAccountRepo.save(financialAccount);

    const response = {
  ...savedFinancialAccount,
  paymentMethod: {
    ...savedFinancialAccount.paymentMethod,
    type: savedFinancialAccount.paymentMethod.type ?? undefined,
  },
};

return response;
  } catch (err) {
    throw new BadRequestException(`Error creando la cuenta financiera: ${err.message}`);
  }
}

  async findAllReceiver() {
    return await this.receiverService.findAll();
  }

  async findAllSender() {
    return await this.senderService.findAll();
  }

  async findOneSender(id: string) {
    return await this.senderService.findOne(id);
  }

  async findOneReceiver(id: string) {
    return await this.receiverService.findOne(id);
  }

  async updateSender(id: string, dto: UpdateSenderFinancialAccountDto) {
    const existingAccount = await this.senderService.findById(id);

    if (!existingAccount) {
      throw new NotFoundException(`Cuenta emisora con ID ${id} no encontrada`);
    }

    const currentPaymentMethod = existingAccount.paymentMethod;
    const incomingPaymentMethod = dto.paymentMethod;

    // Caso: se intenta cambiar el método actual por uno diferente
    if (currentPaymentMethod && incomingPaymentMethod) {
      const currentPlatformId = currentPaymentMethod.platformId?.toLowerCase();
      const currentMethod = currentPaymentMethod.method?.toLowerCase();

      const newPlatformId = incomingPaymentMethod.platformId?.toLowerCase();
      const newMethod = incomingPaymentMethod.method?.toLowerCase();

      const isDifferent = currentPlatformId !== newPlatformId || currentMethod !== newMethod;

      if (isDifferent) {
        throw new BadRequestException(
          `Método de pago inválido. Esta cuenta tiene registrado platformId: '${currentPlatformId}' y method: '${currentMethod}', no puede cambiarse a '${newPlatformId}' / '${newMethod}'.`,
        );
      }
    }

    // Si no hay método actual, se permite agregar uno nuevo
    return await this.senderService.update(id, dto);
  }

  async updateReceiver(id: string, dto: UpdateReceiverFinancialAccountDto) {
    const existingAccount = await this.receiverService.findById(id);

    if (!existingAccount) {
      throw new NotFoundException(`Cuenta receptora con ID ${id} no encontrada`);
    }

    const currentPaymentMethod = existingAccount.paymentMethod;
    const incomingPaymentMethod = dto.paymentMethod;

    // Caso: se intenta cambiar el método actual por uno diferente
    if (currentPaymentMethod && incomingPaymentMethod) {
      const currentPlatformId = currentPaymentMethod.platformId?.toLowerCase();
      const currentMethod = currentPaymentMethod.method?.toLowerCase();

      const newPlatformId = incomingPaymentMethod.platformId?.toLowerCase();
      const newMethod = incomingPaymentMethod.method?.toLowerCase();

      const isDifferent = currentPlatformId !== newPlatformId || currentMethod !== newMethod;

      if (isDifferent) {
        throw new BadRequestException(
          `Método de pago inválido. Esta cuenta tiene registrado platformId: '${currentPlatformId}' y method: '${currentMethod}', no puede cambiarse a '${newPlatformId}' / '${newMethod}'.`,
        );
      }
    }

    // Si no hay método actual, se permite agregar uno nuevo
    return await this.receiverService.update(id, dto);
  }

async deleteById(id: string): Promise<void> {

  const senderDeleted = await this.senderService.delete(id);
  if (senderDeleted) return;

  const receiverDeleted = await this.receiverService.delete(id);
  if (receiverDeleted) return;

  const financialAccount = await this.financialAccountRepo.findOneBy({ id });
  if (!financialAccount) {
    throw new NotFoundException(`No se encontró ninguna cuenta financiera con el ID: ${id}`);
  }

  await this.financialAccountRepo.delete({ id });
}

}
