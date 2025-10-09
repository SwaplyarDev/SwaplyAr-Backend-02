import { InjectRepository } from "@nestjs/typeorm";
import { Transaction } from "@transactions/entities/transaction.entity";
import { User } from "@users/entities/user.entity";
import { DiscountCode } from "src/modules/discounts/entities/discount-code.entity";
import { UserDiscount } from "src/modules/discounts/entities/user-discount.entity";
import { UserRewardsLedger } from "src/modules/discounts/entities/user-rewards-ledger.entity";
import { Repository } from "typeorm";
import { CreateDiscountCodeDto } from "./dto/create-discount-code.dto";
import { BadRequestException, NotFoundException } from "@nestjs/common";
import { FilterTypeEnum, FilterUserDiscountsDto } from "./dto/filter-user-discounts.dto";
import { UserDiscountHistoryDto } from "src/modules/discounts/dto/user-discount-history.dto";



export class AdminDiscountService {
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

  /**
  
  * Crea un código de descuento global, un descuento de usuario sin usar y sin fecha y devuelve el código completo.
async createDiscountCode(
  dto: CreateDiscountCodeDto,
  userId: string
): Promise<DiscountCode> {
  const user = await this.userRepo.findOne({ where: { id: userId } });
  if (!user) {
    throw new NotFoundException('Usuario no encontrado');
  }

  let discountCode = await this.discountCodeRepo.findOne({
    where: { code: dto.code },
  });

  if (!discountCode) {
    discountCode = this.discountCodeRepo.create({
      code: dto.code,
      value: dto.value,
      currencyCode: dto.currencyCode,
      validFrom: new Date(dto.validFrom),
    });
    await this.discountCodeRepo.save(discountCode);
  }

  const existingUserDiscount = await this.userDiscountRepo.findOne({
    where: {
      user: { id: userId },
      discountCode: { id: discountCode.id },
    },
    relations: ['discountCode'],
  });

  if (existingUserDiscount) {
    throw new BadRequestException(
      `El usuario ya tiene asignado el código ${dto.code}`,
    );
  }
  const userDiscount = this.userDiscountRepo.create({
    user,
    discountCode,
    isUsed: false,
  });

  await this.userDiscountRepo.save(userDiscount);

  return discountCode;
}

 * Obtiene todos los códigos de descuento globales, incluyendo detalles.
  async getAllDiscountCodes(): Promise<DiscountCode[]> {
    return await this.discountCodeRepo.find();
  }

  * Obtiene un código de descuento global por su ID, incluyendo mensaje adicional si no se encuentra.
  async getDiscountByCodeId(id: string): Promise<DiscountCode> {
    const code = await this.findDiscountCodeByIdOrThrow(id);
    return code;
  }
   */

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

async getUserDiscountHistoryByAdmin (userId: string): Promise<UserDiscountHistoryDto[]> {
  const userDiscounts = await this.userDiscountRepo.find ({
    where: { user: { id: userId }, isUsed: true },
    relations: ['discountCode'],
    order: { createdAt: 'DESC' },
  });

  return userDiscounts.map ((ud) => ({
    id: ud.id,
    code: ud.discountCode.code,
    value: ud.discountCode.value,
    currencyCode: ud.discountCode.currencyCode,
    isUsed: ud.isUsed,
    createdAt: ud.createdAt,
    usedAt: ud.usedAt,

  }));
}    
}