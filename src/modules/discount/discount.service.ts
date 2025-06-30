import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DiscountEntity } from '@discount/entities/discount.entity';
import { UserDiscountEntity } from '@discount/entities/user-discount.entity';
import { RewardEntity } from '@discount/entities/reward.entity';
import { CreateDiscountDto } from '@discount/dto/create-discount.dto';
import { FilterUserDiscountsDto } from '@discount/dto/filter-user-discounts.dto';
import { UpdateDiscountDto } from '@discount/dto/update-discount.dto';
import { UpdateStarDto } from '@discount/dto/update-star.dto';
import { DiscountTypeEnum } from '@discount/enum/discount-type.enum';
import { FilterTypeEnum } from '@discount/enum/filter-type.enum';

@Injectable()
export class DiscountService {
  constructor(
    @InjectRepository(DiscountEntity)
    private readonly discountRepo: Repository<DiscountEntity>,

    @InjectRepository(UserDiscountEntity)
    private readonly userDiscountRepo: Repository<UserDiscountEntity>,

    @InjectRepository(RewardEntity)
    private readonly rewardRepo: Repository<RewardEntity>,
  ) {}

  async createDiscount(dto: CreateDiscountDto) {
    const discountValue =
      dto.typeCode === DiscountTypeEnum.COMPLETED
        ? '10'
        : dto.typeCode === DiscountTypeEnum.VERIFIED
          ? '5'
          : '3';

    const discount = this.discountRepo.create({
      code: this.generateCode(dto.typeCode),
      discount_value: discountValue,
      currency_code: 'USD',
      valid_from: new Date(),
    });

    await this.discountRepo.save(discount);

    const userDiscount = this.userDiscountRepo.create({
      code_id: discount.code_id,
      user_id: dto.userId,
    });

    await this.userDiscountRepo.save(userDiscount);

    return { data: userDiscount.user_discounts_id };
  }

  async getExistingCodes() {
    const codes = await this.discountRepo.find();
    return { data: codes };
  }

  async getDiscountCodeById(codeId: string) {
    const code = await this.discountRepo.findOne({
      where: { code_id: codeId },
    });
    if (!code) throw new NotFoundException('Discount code not found');
    return { data: code };
  }

  async getAllUserDiscounts(filterDto: FilterUserDiscountsDto) {
    const query = this.userDiscountRepo
      .createQueryBuilder('ud')
      .leftJoinAndSelect('ud.discount', 'discount');

    if (filterDto.filterType && filterDto.filterType !== FilterTypeEnum.ALL) {
      const used = filterDto.filterType === FilterTypeEnum.USED;
      query.andWhere('ud.is_used = :used', { used });
    }

    const results = await query.getMany();
    return { data: results };
  }

  async getUserDiscounts(filterDto: FilterUserDiscountsDto, userId: string) {
    const query = this.userDiscountRepo
      .createQueryBuilder('ud')
      .leftJoinAndSelect('ud.discount', 'discount')
      .where('ud.user_id = :userId', { userId });

    if (filterDto.filterType && filterDto.filterType !== FilterTypeEnum.ALL) {
      const used = filterDto.filterType === FilterTypeEnum.USED;
      query.andWhere('ud.is_used = :used', { used });
    }

    const results = await query.getMany();
    return { data: results };
  }

  async getUserDiscountById(discountId: string) {
    const ud = await this.userDiscountRepo.findOne({
      where: { user_discounts_id: discountId },
    });
    if (!ud) throw new NotFoundException('User discount not found');
    return { data: ud };
  }

  async updateUserDiscount(dto: UpdateDiscountDto, userId: string) {
    const ud = await this.userDiscountRepo.findOne({
      where: { user_discounts_id: dto.discountId },
    });
    if (!ud) throw new NotFoundException('User discount not found');
    if (ud.user_id !== userId) throw new ForbiddenException();

    ud.is_used = true;
    ud.transactions_id = dto.transactionId;
    ud.used_at = new Date();

    await this.userDiscountRepo.save(ud);
    return { data: 'updated discount' };
  }

  async deleteDiscount(discountId: string, userId: string) {
    const ud = await this.userDiscountRepo.findOne({
      where: { user_discounts_id: discountId },
    });
    if (!ud) throw new NotFoundException('User discount not found');
    if (ud.user_id !== userId) throw new ForbiddenException();

    await this.userDiscountRepo.remove(ud);
    return { data: 'deleted discount' };
  }

  async updateStars(dto: UpdateStarDto, userId: string) {
    let reward = await this.rewardRepo.findOne({
      where: { user_id: userId },
    });

    if (!reward) {
      reward = this.rewardRepo.create({
        user_id: userId,
        quantity: 0,
        stars: 0,
      });
    }

    reward.quantity += dto.quantity;
    reward.stars += 1;

    const completedCycles = Math.floor(reward.quantity / 500);
    if (completedCycles > 0) {
      reward.quantity = reward.quantity % 500;
      reward.stars = 0;
      await this.rewardRepo.save(reward);
      return { data: true };
    }

    await this.rewardRepo.save(reward);
    return { data: false };
  }

  async getStars(userId: string) {
    const reward = await this.rewardRepo.findOne({
      where: { user_id: userId },
    });
    return {
      data: {
        quantity: reward?.quantity || 0,
        stars: reward?.stars || 0,
      },
    };
  }

  private generateCode(type: DiscountTypeEnum): string {
    const randomPart = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `${type.toUpperCase()}-${randomPart}`;
  }
}
