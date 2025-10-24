

import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '@users/entities/user.entity';
import { UserProfile } from '@users/entities/user-profile.entity';
import { Transaction } from 'src/modules/transactions/entities/transaction.entity';
import { UserRewardsLedger } from 'src/modules/discounts/entities/user-rewards-ledger.entity';
import { DiscountCode } from 'src/modules/discounts/entities/discount-code.entity';
import { UserDiscount } from 'src/modules/discounts/entities/user-discount.entity';
import { ConversionsService } from 'src/modules/conversions/services/conversions.service';
import { AdminStatus } from 'src/enum/admin-status.enum';
import { DiscountService } from '../../discounts/discounts.service';

@Injectable()
export class UpdateStarsService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,

    @InjectRepository(UserProfile)
    private readonly userProfileRepo: Repository<UserProfile>,

    @InjectRepository(Transaction)
    private readonly transactionRepo: Repository<Transaction>,

    @InjectRepository(UserRewardsLedger)
    private readonly rewardsLedgerRepo: Repository<UserRewardsLedger>,

    @InjectRepository(DiscountCode)
    private readonly discountCodeRepo: Repository<DiscountCode>,

    @InjectRepository(UserDiscount)
    private readonly userDiscountRepo: Repository<UserDiscount>,

    private readonly discountService: DiscountService,
    private readonly conversionsService: ConversionsService,
  ) {}

  async updateStars(transactionId: string): Promise<{
    cycleCompleted: boolean;
    ledger: UserRewardsLedger;
    message?: string;
  }> {
    if (!transactionId) {
      throw new BadRequestException('Se requiere transactionId para actualizar recompensas.');
    }

    const transaction = await this.transactionRepo.findOne({
      where: { id: transactionId },
      relations: ['senderAccount'],
    });

    if (!transaction) {
      throw new NotFoundException('Transacción no encontrada.');
    }

    if (transaction.finalStatus !== AdminStatus.Completed) {
      throw new BadRequestException(
        'Solo se pueden registrar recompensas de transacciones completadas.',
      );
    }

    const senderEmail = transaction.senderAccount?.createdBy;
    if (!senderEmail) {
      throw new BadRequestException(
        'No se encontró el email del remitente de la transacción.',
      );
    }

    const userProfile = await this.userProfileRepo.findOne({
      where: { email: senderEmail },
      relations: ['user'],
    });

    const user = userProfile?.user;
    if (!user) {
      throw new BadRequestException(
        'No se encontró el usuario asociado al remitente de la transacción.',
      );
    }

    const fromCurrency = transaction.amountCurrency;
    const baseAmount = Number(transaction.amountValue) || 0;

    if (!fromCurrency || !baseAmount) {
      throw new BadRequestException('La transacción no tiene monto o moneda válidos.');
    }

    let convertedAmount = 0;

    if (fromCurrency === 'EUR') {
      const { convertedAmount: eurToUsd } = await this.conversionsService.convert({
        from: 'EUR',
        to: 'USD',
        amount: baseAmount,
      });
      convertedAmount = eurToUsd;
    } else if (fromCurrency === 'ARS') {
      const { convertedAmount: arsToUsd } = await this.conversionsService.convertArsIndirect({
        from: 'ARS',
        to: 'USD',
        amount: baseAmount,
      });
      convertedAmount = arsToUsd;
    } else if (fromCurrency === 'BRL') {
      const { convertedAmount: brlToUsd } = await this.conversionsService.convertArsIndirect({
        from: 'BRL',
        to: 'USD',
        amount: baseAmount,
      });
      convertedAmount = brlToUsd;
    } else if (fromCurrency === 'USD') {
      convertedAmount = baseAmount;
    } else {
      throw new BadRequestException(`Conversión no soportada desde ${fromCurrency} a USD.`);
    }

    const ledger = await this.getOrCreateUserLedger(user.id);

    ledger.quantity = Number(ledger.quantity) + Number(convertedAmount);
    ledger.stars = ledger.stars + 1;

    if (ledger.quantity > 500) ledger.quantity = 500;
    if (ledger.stars > 5) ledger.stars = 5;

    await this.rewardsLedgerRepo.save(ledger);

    const cycleCompleted = ledger.stars === 5 && ledger.quantity === 500;
    let message: string | undefined;

    if (cycleCompleted) {
      message = await this.handleCycleCompletion(ledger);
    }

    return {
      cycleCompleted,
      ledger,
      message,
    };
  }

  private async getOrCreateUserLedger(userId: string): Promise<UserRewardsLedger> {
    let ledger = await this.rewardsLedgerRepo.findOne({
      where: { user: { id: userId } },
      relations: ['user'],
    });

    if (!ledger) {
      const user = await this.userRepo.findOne({ where: { id: userId } });
      if (!user) {
        throw new NotFoundException('Usuario no encontrado.');
      }

      ledger = this.rewardsLedgerRepo.create({
        user,
        stars: 0,
        quantity: 0,
      });
      await this.rewardsLedgerRepo.save(ledger);
    }

    return ledger;
  }

  private async handleCycleCompletion(ledger: UserRewardsLedger): Promise<string> {
    ledger.quantity = 0;
    ledger.stars = 0;
    await this.rewardsLedgerRepo.save(ledger);

    const user = ledger.user;
    if (!user) {
      throw new NotFoundException('Usuario no encontrado en el ledger.');
    }

    const discount = await this.discountService.assignSystemDiscount(user, 'PLUS', 10);

    return `¡Felicidades! Completaste un ciclo y se ha generado tu cupón PLUS REWARDS. Código: ${discount.code}, Válido desde: ${discount.validFrom.toLocaleDateString()}, Valor: ${discount.value} ${discount.currencyCode}.`;
  }
}







