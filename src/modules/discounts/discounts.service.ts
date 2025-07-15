import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {RegisterUserDto} from "@users/dto/register-user.dto";
import {UserProfile} from "@users/entities/user-profile.entity";
import {UserRewardsLedger} from "@users/entities/user-rewards-ledger.entity";
import {CreateDiscountDto} from "./dto/create-discount.dto";


@Injectable()
export class DiscountsService {
  constructor(
      @InjectRepository(Discounts) private readonly discountRepository: Repository<Discounts>,
  ) {
      async create(createDisscountDto: CreateDiscountDto):{

          }

  }
}
