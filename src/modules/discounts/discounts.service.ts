import { NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { User } from '@users/entities/user.entity';
import { Transaction } from '@transactions/entities/transaction.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AdminStatus } from 'src/enum/admin-status.enum';
import { UserRole } from 'src/enum/user-role.enum';
import { DiscountCode } from './entities/discount-code.entity';
import { UserDiscount } from './entities/user-discount.entity';
import { UserRewardsLedger } from './entities/user-rewards-ledger.entity';
import { CreateDiscountCodeDto } from '../admin/discounts/dto/create-discount-code.dto';
import {
  FilterTypeEnum,
  FilterUserDiscountsDto,
} from '../admin/discounts/dto/filter-user-discounts.dto';
import { UpdateUserDiscountDto } from './dto/update-user-discount.dto';
import { UserDiscountHistoryDto } from './dto/user-discount-history.dto';
import { UpdateStarDto } from './dto/update-star.dto';

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
   * Crea y asigna un descuento de sistema (bienvenida, verificación, etc.) para un usuario.
   * @param user Usuario destinatario.
   * @param prefix Prefijo para el código (e.g., "WELCOME", "VERIFIED").
   * @param value Valor del descuento.
   * @returns El id del descuento de usuario creado.
   */
  async assignSystemDiscount(user: User, prefix: string, value: number): Promise<string> {
    const codeEntity = this.discountCodeRepo.create({
      code: `${prefix}-${Math.random().toString(36).substr(2, 6)}`.toUpperCase(),
      value,
      currencyCode: 'USD',
      validFrom: new Date(),
    });
    await this.discountCodeRepo.save(codeEntity);

    const userDiscount = this.userDiscountRepo.create({
      user,
      discountCode: codeEntity,
      isUsed: false,
    });
    await this.userDiscountRepo.save(userDiscount);

    return userDiscount.id;
  }

  /**
   * Obtiene todos los descuentos de usuarios con filtro opcional y sus datos relacionados.
   */
  async getAllUserDiscounts(filterDto: FilterUserDiscountsDto): Promise<UserDiscount[]> {
    const qb = this.userDiscountRepo
      .createQueryBuilder('ud')
      .leftJoinAndSelect('ud.user', 'user')
      .leftJoinAndSelect('ud.discountCode', 'code')
      .leftJoinAndSelect('ud.transactions', 'transaction');
    this.applyUserDiscountsFilter(qb, filterDto);
    return qb.getMany();
  }

  /**
   * Obtiene descuentos disponibles de un usuario específico.
   */
  async getAvailableUserDiscounts(userId: string): Promise<UserDiscount[]> {
    const qb = this.userDiscountRepo
      .createQueryBuilder('ud')
      .leftJoin('ud.user', 'user')
      .leftJoinAndSelect('ud.discountCode', 'code')
      .where('user.id = :userId', { userId })
      .andWhere('ud.isUsed = :isUsed', { isUsed: false });
    return qb.getMany();
  }

  /* Obtiene descuentos de un usuario específico por su user_id */
  async getUserDiscountsByUserId(id: string, userRole?: UserRole): Promise<UserDiscount[]> {
    const qd = this.userDiscountRepo
      .createQueryBuilder('ud')
      .leftJoinAndSelect('ud.user', 'user')
      .leftJoinAndSelect('ud.discountCode', 'code')
      .leftJoinAndSelect('ud.transactions', 'transaction')
      .where('user.id = :id', { id });

    const ud = await qd.getMany();

    if (!ud) throw new NotFoundException('Descuento de usuario no encontrado');

    if (![UserRole.Admin, UserRole.SuperAdmin].includes(userRole ?? UserRole.User)) {
      throw new ForbiddenException('No tiene permiso para acceder a este descuento');
    }

    return ud;
  }

  /**
   * Obtiene un descuento de usuario por ID, verifica propiedad y devuelve toda la información relevante.
   */
  async getUserDiscountById(
    id: string,
    userId: string,
    userRole?: UserRole,
  ): Promise<UserDiscount> {
    const ud = await this.userDiscountRepo.findOne({
      where: { id },
      relations: ['user', 'discountCode', 'transactions'],
    });
    if (!ud) throw new NotFoundException('Descuento de usuario no encontrado');
    /*if (ud.user.id !== userId && !['admin', 'super_admin'].includes(userRole || '')) {
      throw new ForbiddenException('No tiene permiso para acceder a este descuento');
    }*/

    if (ud.user.id !== userId && userRole !== UserRole.Admin && userRole !== UserRole.SuperAdmin) {
      throw new ForbiddenException('No tiene permiso para acceder a este descuento');
    }

    return ud;
  }

  /**
   * Alterna el estado de un descuento de usuario:
   * - Si no estaba usado → marcar como usado y asociar a la transacción indicada en el DTO.
   * - Si estaba usado → desmarcar, borrar usedAt y desasociar de la transacción.
   */
  async updateUserDiscount(
    id: string,
    dto: UpdateUserDiscountDto,
    userId: string,
  ): Promise<UserDiscount> {
    const ud = await this.getUserDiscountById(id, userId);

    if (!ud.isUsed) {
      ud.isUsed = true;
      ud.usedAt = new Date();

      if (dto.transactionId) {
        const transaction = await this.transactionRepo.findOne({
          where: { id: dto.transactionId },
        });

        if (!transaction) {
          throw new NotFoundException('Transacción no encontrada');
        }

        const alreadyLinked = ud.transactions?.some((t) => t.id === transaction.id);
        if (!alreadyLinked) {
          ud.transactions = [...(ud.transactions || []), transaction];
        }
      }
    } else {
      ud.isUsed = false;
      ud.usedAt = null;

      if (dto.transactionId && ud.transactions?.length) {
        ud.transactions = ud.transactions.filter((t) => t.id !== dto.transactionId);
      }
    }

    await this.userDiscountRepo.save(ud);

    const updatedUd = await this.userDiscountRepo.findOne({
      where: { id: ud.id },
      relations: ['user', 'discountCode', 'transactions'],
    });

    if (!updatedUd) {
      throw new NotFoundException('Descuento de usuario no encontrado tras actualizar');
    }

    return updatedUd;
  }

  async getUserDiscountHistory(userId: string): Promise<UserDiscountHistoryDto[]> {
    const userDiscounts = await this.userDiscountRepo.find({
      where: { user: { id: userId }, isUsed: true },
      relations: ['discountCode'],
      order: { createdAt: 'DESC' },
    });

    return userDiscounts.map((ud) => ({
      id: ud.id,
      code: ud.discountCode.code,
      value: ud.discountCode.value,
      currencyCode: ud.discountCode.currencyCode,
      isUsed: ud.isUsed,
      createdAt: ud.createdAt,
      usedAt: ud.usedAt,
    }));
  }

  async getUserDiscountHistoryByAdmin(userId: string): Promise<UserDiscountHistoryDto[]> {
    const userDiscounts = await this.userDiscountRepo.find({
      where: { user: { id: userId }, isUsed: true },
      relations: ['discountCode'],
      order: { createdAt: 'DESC' },
    });

    return userDiscounts.map((ud) => ({
      id: ud.id,
      code: ud.discountCode.code,
      value: ud.discountCode.value,
      currencyCode: ud.discountCode.currencyCode,
      isUsed: ud.isUsed,
      createdAt: ud.createdAt,
      usedAt: ud.usedAt,
    }));
  }

  /**
   * Elimina un descuento de usuario y devuelve un mensaje de confirmación.
   */
  async deleteUserDiscount(id: string): Promise<{ success: boolean; message: string }> {
    const ud = await this.userDiscountRepo.findOne({ where: { id } });
    if (!ud) throw new NotFoundException('Descuento de usuario no encontrado');
    await this.userDiscountRepo.remove(ud);
    return {
      success: true,
      message: `El descuento con id '${id}' fue eliminado correctamente.`,
    };
  }

  // ... El resto de métodos privados y de recompensas igual

  /**
   * Suma `quantity` al acumulado del usuario.
   * Devuelve información detallada: si completó el ciclo, el ledger actualizado y un mensaje.
   */
  async updateStars(
    dto: UpdateStarDto,
    userId: string,
  ): Promise<{
    cycleCompleted: boolean;
    ledger: UserRewardsLedger;
    message?: string;
  }> {
    // Verifica que se pase el transactionId
    if (!dto.transactionId) {
      throw new BadRequestException('Se requiere transactionId para asignar estrellas.');
    }

    // Busca la transacción y verifica su estado
    const transaction = await this.transactionRepo.findOne({
      where: { id: dto.transactionId },
    });
    if (!transaction) {
      throw new NotFoundException('Transacción no encontrada');
    }
    if (transaction.finalStatus !== AdminStatus.Completed) {
      throw new BadRequestException(
        'Solo se pueden asignar estrellas a transacciones completadas.',
      );
    }

    const ledger = await this.getOrCreateUserLedger(userId);

    ledger.quantity = Number(ledger.quantity) + Number(dto.quantity);
    //límite de 5 estrellas
    if (ledger.stars < 5) {
      ledger.stars += 1;
    }
    await this.rewardsLedgerRepo.save(ledger);

    const cycleCompleted =
      ledger.quantity >= DiscountService.CYCLE_QUANTITY &&
      ledger.stars >= DiscountService.CYCLE_STARS;
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

  /**
   * Lógica que corre cuando el usuario completa un ciclo:
   * - Reinicia contadores
   * - Crea/activa un nuevo código de descuento PLUS REWARDS
   * - Puede enviar notificaciones, emails, etc.
   */
  private async handleCycleCompletion(ledger: UserRewardsLedger): Promise<string> {
    // Reiniciamos contadores
    ledger.quantity = 0;
    ledger.stars = 0;
    await this.rewardsLedgerRepo.save(ledger);

    //creamos un código de descuento de 10 USD
    const discountCode = this.discountCodeRepo.create({
      code: `PLUS-${Date.now().toString(36).toUpperCase()}`,
      value: 10,
      currencyCode: 'USD',
      validFrom: new Date(),
    });
    await this.discountCodeRepo.save(discountCode);

    // Asociamos automáticamente ese código al usuario
    await this.userDiscountRepo.save(
      this.userDiscountRepo.create({
        user: ledger.user,
        discountCode,
        isUsed: false,
      }),
    );

    return '¡Felicidades! Completaste un ciclo y se ha generado tu cupón PLUS REWARDS de 10 USD.';
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

  /** Métodos auxiliares privados para mejorar legibilidad/reutilización **/

  private async findUserByIdOrThrow(userId: string): Promise<User> {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('Usuario no encontrado');
    return user;
  }

  private async findDiscountCodeByIdOrThrow(discountCodeId: string): Promise<DiscountCode> {
    const discountCode = await this.discountCodeRepo.findOne({
      where: { id: discountCodeId },
    });
    if (!discountCode) throw new NotFoundException('Código de descuento no válido');
    return discountCode;
  }

  private async findTransactionByIdOrThrow(transactionId: string): Promise<Transaction> {
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
      isUsed: !!transaction,
      usedAt: transaction ? new Date() : undefined,
      ...(transaction ? { transactions: [transaction] } : {}),
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
}
