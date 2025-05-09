import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Pix } from "./entities/pix.entity";
import { Repository } from "typeorm";
import { CreatePixDto } from "./dto/create-pix.dto";

@Injectable()
export class PixService {
  constructor(@InjectRepository(Pix) private readonly pixRepository : Repository<Pix> ) {}

  async create(createPixDto: CreatePixDto,platformId: string) {

    if (createPixDto) {
      const newPix = this.pixRepository.create({...createPixDto, platformId});
      return await this.pixRepository.save(newPix);
    } else {
      return null;
    }
  }

  
}