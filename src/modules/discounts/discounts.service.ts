import {
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { DiscountCode } from '@users/entities/discount-code.entity';
import { UserDiscount } from '@users/entities/user-discount.entity';
import { User } from '@users/entities/user.entity';
import { Transaction } from '@transactions/entities/transaction.entity';
import { CreateUserDiscountDto } from './dto/create-user-discount.dto';
import {
  FilterTypeEnum,
  FilterUserDiscountsDto,
} from './dto/filter-user-discounts.dto';
import { UpdateUserDiscountDto } from './dto/update-user-discount.dto';
import { CreateDiscountCodeDto } from './dto/create-discount-code.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateStarDto } from '@discounts/dto/update-star.dto';
import { UserRewardsLedger } from '@users/entities/user-rewards-ledger.entity';

export class DiscountService {
  constructor(
    @InjectRepository(DiscountCode)
    private readonly discountCodeRepo: Repository<DiscountCode>,
    @InjectRepository(UserDiscount)
    private readonly userDiscountRepo: Repository<UserDiscount>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Transaction)
    private readonly transactionRepo: Repository<Transaction>,
    @InjectRepository(UserRewardsLedger)
    private readonly rewardsLedgerRepo: Repository<UserRewardsLedger>,
  ) {}

  /**
   * Crea un código de descuento global
   */
  async createDiscountCode(dto: CreateDiscountCodeDto): Promise<string> {
    const exists = await this.discountCodeRepo.findOne({
      where: { code: dto.code },
    });
    if (exists) {
      throw new BadRequestException(`El código '${dto.code}' ya existe`);
    }
    const discountCode = this.discountCodeRepo.create({
      code: dto.code,
      value: dto.value,
      currencyCode: dto.currencyCode,
      validFrom: new Date(dto.validFrom),
    });
    await this.discountCodeRepo.save(discountCode);
    return discountCode.id;
  }

  /**
   * Crea un nuevo descuento de usuario basado en un código existente
   */
  async createUserDiscount(dto: CreateUserDiscountDto): Promise<string> {
    const user = await this.findUserByIdOrThrow(dto.userId);
    const discountCode = await this.findDiscountCodeByIdOrThrow(
      dto.discountCodeId,
    );
    const transaction = dto.transactionId
      ? await this.findTransactionByIdOrThrow(dto.transactionId)
      : null;
    const userDiscount = this.createUserDiscountEntity(
      user,
      discountCode,
      transaction,
    );
    await this.userDiscountRepo.save(userDiscount);
    return userDiscount.id;
  }

  /**
   * Obtiene todos los códigos de descuento globales
   */
  async getAllDiscountCodes(): Promise<DiscountCode[]> {
    return this.discountCodeRepo.find();
  }

  /**
   * Obtiene un código de descuento global por su ID
   */
  async getDiscountByCodeId(id: string): Promise<DiscountCode> {
    return this.findDiscountCodeByIdOrThrow(id);
  }

  /**
   * Obtiene todos los descuentos de usuarios con filtro opcional
   */
  async getAllUserDiscounts(
    filterDto: FilterUserDiscountsDto,
  ): Promise<UserDiscount[]> {
    const qb = this.userDiscountRepo
      .createQueryBuilder('ud')
      .leftJoinAndSelect('ud.user', 'user')
      .leftJoinAndSelect('ud.discountCode', 'code')
      .leftJoinAndSelect('ud.transaction', 'transaction');

    this.applyUserDiscountsFilter(qb, filterDto);

    return qb.getMany();
  }

  /**
   * Obtiene descuentos de un usuario específico
   */
  async getUserDiscounts(
    filterDto: FilterUserDiscountsDto,
    userId: string,
  ): Promise<UserDiscount[]> {
    const qb = this.userDiscountRepo
      .createQueryBuilder('ud')
      .leftJoinAndSelect('ud.user', 'user')
      .leftJoinAndSelect('ud.discountCode', 'code')
      .leftJoinAndSelect('ud.transaction', 'transaction')
      .where('user.id = :userId', { userId });

    this.applyUserDiscountsFilter(qb, filterDto);

    return qb.getMany();
  }

  /**
   * Obtiene un descuento de usuario por ID y verifica propiedad
   */
  async getUserDiscountById(id: string, userId: string): Promise<UserDiscount> {
    const ud = await this.userDiscountRepo.findOne({
      where: { id },
      relations: ['user', 'discountCode', 'transaction'],
    });
    if (!ud) throw new NotFoundException('Descuento de usuario no encontrado');
    if (ud.user.id !== userId)
      throw new ForbiddenException(
        'No tiene permiso para acceder a este descuento',
      );
    return ud;
  }

  /**
   * Marca un descuento como usado y asocia transacción
   */
  async updateUserDiscount(
    id: string,
    dto: UpdateUserDiscountDto,
    userId: string,
  ): Promise<void> {
    const ud = await this.getUserDiscountById(id, userId);
    const transaction = await this.findTransactionByIdOrThrow(
      dto.transactionId,
    );
    ud.isUsed = true;
    ud.transaction = transaction;
    ud.usedAt = new Date();
    await this.userDiscountRepo.save(ud);
  }

  /**
   * Elimina un descuento de usuario
   */
  async deleteUserDiscount(id: string): Promise<void> {
    const ud = await this.userDiscountRepo.findOne({ where: { id } });
    if (!ud) throw new NotFoundException('Descuento de usuario no encontrado');
    await this.userDiscountRepo.remove(ud);
  }

  /** Métodos auxiliares privados para mejorar legibilidad/reutilización **/

  private async findUserByIdOrThrow(userId: string): Promise<User> {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('Usuario no encontrado');
    return user;
  }

  private async findDiscountCodeByIdOrThrow(
    discountCodeId: string,
  ): Promise<DiscountCode> {
    const discountCode = await this.discountCodeRepo.findOne({
      where: { id: discountCodeId },
    });
    if (!discountCode)
      throw new NotFoundException('Código de descuento no válido');
    return discountCode;
  }

  private async findTransactionByIdOrThrow(
    transactionId: string,
  ): Promise<Transaction> {
    const transaction = await this.transactionRepo.findOne({
      where: { id: transactionId },
    });
    if (!transaction) throw new NotFoundException('Transacción no encontrada');
    return transaction;
  }

  private createUserDiscountEntity(
    user: User,
    discountCode: DiscountCode,
    transaction: Transaction | null,
  ): UserDiscount {
    return this.userDiscountRepo.create({
      user,
      discountCode,
      transaction: transaction ?? undefined,
      isUsed: !!transaction,
      usedAt: transaction ? new Date() : undefined,
    });
  }

  private applyUserDiscountsFilter(
    qb: import('typeorm').SelectQueryBuilder<UserDiscount>,
    filterDto: FilterUserDiscountsDto,
  ): void {
    if (filterDto.filterType && filterDto.filterType !== FilterTypeEnum.ALL) {
      if (filterDto.filterType === FilterTypeEnum.USED) {
        qb.andWhere('ud.isUsed = :used', { used: true });
      } else if (filterDto.filterType === FilterTypeEnum.AVAILABLE) {
        qb.andWhere('ud.isUsed = :used', { used: false });
      }
    }
  }
  /*** RECOMPENSAS / ESTRELLAS ***/

  private static readonly CYCLE_QUANTITY = 500;
  private static readonly CYCLE_STARS = 5;

  /**
   * Suma `quantity` al acumulado del usuario.
   * Devuelve `true` si al sumar se completa un ciclo (>=500 y 5 transacciones), y reinicia contadores.
   */
  async updateStars(dto: UpdateStarDto, userId: string): Promise<boolean> {
    const ledger = await this.getOrCreateUserLedger(userId);

    ledger.quantity += dto.quantity;
    ledger.stars += 1;

    const cycleCompleted =
      ledger.quantity >= DiscountService.CYCLE_QUANTITY &&
      ledger.stars >= DiscountService.CYCLE_STARS;

    if (cycleCompleted) {
      ledger.quantity = 0;
      ledger.stars = 0;
    }

    await this.rewardsLedgerRepo.save(ledger);
    return cycleCompleted;
  }

  async getStars(userId: string): Promise<{ quantity: number; stars: number }> {
    const ledger = await this.rewardsLedgerRepo.findOne({
      where: { user: { id: userId } },
      relations: ['user'],
    });
    return {
      quantity: ledger?.quantity ?? 0,
      stars: ledger?.stars ?? 0,
    };
  }

  private async getOrCreateUserLedger(userId: string) {
    let ledger = await this.rewardsLedgerRepo.findOne({
      where: { user: { id: userId } },
      relations: ['user'],
    });

    if (!ledger) {
      const user = await this.userRepo.findOne({ where: { id: userId } });
      if (!user) throw new NotFoundException('Usuario no encontrado');
      ledger = this.rewardsLedgerRepo.create({ user, quantity: 0, stars: 0 });
    }

    return ledger;
  }
}