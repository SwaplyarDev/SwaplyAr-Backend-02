import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { VirtualBank } from "./entities/virtual-bank.entity";
import { Repository } from "typeorm";
import { CreateVirtualBankDto } from "./dto/create-virtual-bank.dto";

@Injectable()
export class VirtualBankService {
   constructor(@InjectRepository(VirtualBank) private readonly virtualBankRepository: Repository<VirtualBank>) {}
   
   async create(createVirtualBankDto: CreateVirtualBankDto, platformId: string) {
     if (createVirtualBankDto) {
       const newVirtualBank = this.virtualBankRepository.create({ ...createVirtualBankDto, platformId });
       return await this.virtualBankRepository.save(newVirtualBank);
     } else {
       return null;
   }
   }
}