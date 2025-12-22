import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { SenderFinancialAccount } from './entities/sender-financial-account.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateSenderFinancialAccountDto } from './dto/update-sender-financial-account.dto';
import { CreateSenderFinancialAccountDto } from './dto/create-sender-financial-account.dto';
import { PaymentProvidersService } from '../payment-providers/payment-providers.service';
import { User } from '@users/entities/user.entity';
import { Countries } from '../entities/countries.entity';

@Injectable()
export class SenderFinancialAccountsService {
  constructor(
    @InjectRepository(SenderFinancialAccount)
    private readonly senderRepository: Repository<SenderFinancialAccount>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Countries)
    private readonly countriesRepository: Repository<Countries>,
    private readonly paymentProviderService: PaymentProvidersService,
  ) {}

  async create(dto: CreateSenderFinancialAccountDto) {
    const user = await this.userRepository.findOne({
      where: { email: dto.email },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const paymentProvider = await this.paymentProviderService.create(dto.paymentProvider);

    let country: Countries | undefined;

    if (dto.countryCode) {
      const foundCountry = await this.countriesRepository.findOne({
        where: { code: dto.countryCode },
      });

      if (!foundCountry) {
        throw new BadRequestException('Invalid country code');
      }

      country = foundCountry;
    }

    const senderAccount = this.senderRepository.create({
      firstName: dto.firstName,
      lastName: dto.lastName,
      phoneNumber: dto.phoneNumber,
      user,
      country,
      paymentProvider,
    });

    return this.senderRepository.save(senderAccount);
  }

  async findAll() {
    return await this.senderRepository.find({
      relations: { paymentProvider: true },
    });
  }

  async findOne(id: string) {
    return await this.senderRepository.findOne({ where: { senderAccountId: id } });
  }

  async findById(id: string) {
    return this.senderRepository.findOne({
      where: { senderAccountId: id },
      relations: ['paymentProvider'], // si estás usando relaciones
    });
  }

  async update(id: string, dto: UpdateSenderFinancialAccountDto) {
    const senderAccount = await this.senderRepository.findOne({
      where: { senderAccountId: id },
      relations: ['paymentMethod'],
    });

    if (!senderAccount) {
      throw new NotFoundException(`Sender account with ID ${id} not found`);
    }

    // Actualiza campos básicos
    if (dto.firstName) senderAccount.firstName = dto.firstName;
    if (dto.lastName) senderAccount.lastName = dto.lastName;

    // Actualiza el paymentMethod (si se envía)
    if (dto.paymentProvider) {
      Object.assign(senderAccount.paymentProvider, dto.paymentProvider);
    }

    return await this.senderRepository.save(senderAccount);
  }

  async delete(id: string): Promise<boolean> {
    const account = await this.senderRepository.findOne({ where: { senderAccountId: id } });
    if (!account) return false;

    await this.senderRepository.delete(id);
    return true;
  }
}
