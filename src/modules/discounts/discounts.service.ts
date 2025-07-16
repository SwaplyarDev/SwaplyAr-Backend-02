
import {
  Injectable,
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
  ) {}
  /**
   * Crea un código de descuento global
   */
  async createDiscountCode(dto: CreateDiscountCodeDto): Promise<string> {
    // Verificamos unicidad
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
    // 1. Usuario
    const user = await this.userRepo.findOne({ where: { id: dto.userId } });
    if (!user) throw new NotFoundException('Usuario no encontrado');

    // 2. Código de descuento
    const code = await this.discountCodeRepo.findOne({
      where: { id: dto.discountCodeId },
    });
    if (!code) throw new NotFoundException('Código de descuento no válido');

    // 3. Transacción opcional
    let transaction: Transaction | null = null;
    if (dto.transactionId) {
      transaction = await this.transactionRepo.findOne({
        where: { id: dto.transactionId },
      });
      if (!transaction)
        throw new NotFoundException('Transacción no encontrada');
    }

    // 4. Creación de la entidad
    const userDiscount = this.userDiscountRepo.create({
      user,
      discountCode: code,
      transaction: transaction ?? undefined,
      isUsed: !!transaction,
      usedAt: transaction ? new Date() : undefined,
    });

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
    const code = await this.discountCodeRepo.findOne({ where: { id } });
    if (!code) throw new NotFoundException('Código de descuento no encontrado');
    return code;
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

    if (filterDto.filterType && filterDto.filterType !== FilterTypeEnum.ALL) {
      if (filterDto.filterType === FilterTypeEnum.USED) {
        qb.andWhere('ud.isUsed = :used', { used: true });
      } else if (filterDto.filterType === FilterTypeEnum.AVAILABLE) {
        qb.andWhere('ud.isUsed = :used', { used: false });
      }
      // Si es ALL, no se aplica filtro
    }

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

    if (filterDto.filterType && filterDto.filterType !== FilterTypeEnum.ALL) {
      if (filterDto.filterType === FilterTypeEnum.USED) {
        qb.andWhere('ud.isUsed = :used', { used: true });
      } else if (filterDto.filterType === FilterTypeEnum.AVAILABLE) {
        qb.andWhere('ud.isUsed = :used', { used: false });
      }
      // Si es ALL, no se aplica filtro
    }

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

    const transaction = await this.transactionRepo.findOne({
      where: { id: dto.transactionId },
    });
    if (!transaction) throw new NotFoundException('Transacción no encontrada');

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