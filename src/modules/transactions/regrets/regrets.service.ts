import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Regret } from './entities/regrets.entity';
import { CreateRegretDto } from './dto/create-regret.dto';
import { UpdateRegretDto } from './dto/update-regret.dto';
import { SenderFinancialAccount } from 'src/modules/sender-accounts/entities/sender-financial-account.entity';
import { Transaction } from '@transactions/entities/transaction.entity';

@Injectable()
export class RegretsService {
  constructor(
    @InjectRepository(Regret)
    private readonly regretsRepository: Repository<Regret>,

    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
  ) {}

  async create(createRegretDto: CreateRegretDto) {
    const { transaction_id, last_name, email, phone_number } = createRegretDto;

    const transaction = (await this.transactionRepository.findOne({
      where: { id: transaction_id },
      relations: ['senderAccount'],
    })) as Transaction & { senderAccount: SenderFinancialAccount };

    if (!transaction) {
      throw new NotFoundException(`Transacción ${transaction_id} no encontrada`);
    }

    const normalizePhone = (phone: string) => phone.replace(/\D/g, '');

    if (
      transaction.senderAccount.lastName !== last_name ||
      transaction.senderAccount.createdBy !== email ||
      normalizePhone(transaction.senderAccount.phoneNumber) !== normalizePhone(phone_number)
    ) {
      throw new BadRequestException(
        'La información suministrada no coincide con la información de la transacción',
      );
    }

    const regret = this.regretsRepository.create(createRegretDto);
    const savedRegret = await this.regretsRepository.save(regret);

    transaction.regret = savedRegret;
    await this.transactionRepository.save(transaction);

    return savedRegret;
  }

  findAll() {
    return this.regretsRepository.find();
  }

  findOne(id: string) {
    return this.regretsRepository.findOne({ where: { id } });
  }

  update(id: string, updateRegretDto: UpdateRegretDto) {
    return this.regretsRepository.update(id, updateRegretDto);
  }

  remove(id: string) {
    return this.regretsRepository.delete(id);
  }
}
