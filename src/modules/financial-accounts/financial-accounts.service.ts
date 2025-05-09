import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { SenderFinancialAccount } from "./sender-financial-accounts/entities/sender-financial-account.entity";
import { Repository } from "typeorm";
import { ReceiverFinancialAccount } from "./receiver-financial-accounts/entities/receiver-financial-account.entity";
import { CreateFinancialAccountDto } from "./dto/create-financial-accounts.dto";
import { SenderFinancialAccountsService } from "./sender-financial-accounts/sender-financial-accounts.service";
import { ReceiverFinancialAccountsService } from "./receiver-financial-accounts/receiver-financial-accounts.service";

@Injectable()
export class FinancialAccountsService {
    constructor( private readonly senderService : SenderFinancialAccountsService,
      private readonly receiverService: ReceiverFinancialAccountsService
    ){}

  async create(createFinancialAccountDto:CreateFinancialAccountDto) {
    const{senderAccount,receiverAccount} = createFinancialAccountDto;

const sender = await this.senderService.create(senderAccount); // lo guarda en la tabla financial accounts  
    
const receiver = await this.receiverService.create(receiverAccount); // lo guarda en la tabla financial accounts

    return {sender,receiver}; // lo guarda en la tabla financial accounts 
  }

  async findAllReceiver() {
    return await this.receiverService.findAll();
  }

  async findAllSender() {
    return await this.senderService.findAll();
  }


  async findOneSender(id: string) {
    return await this.senderService.findOne(id);
  }

  async findOneReceiver(id: string) {
    return await this.receiverService.findOne(id);
  }





}

/*
 {"senderAccount":{
    "firstName":"Agustin",
    "lastName":"Malugani",
    "identificationNumber":"12345678",
    "phoneNumber":"3413857748",
    "email":"agusmalugani@email.com"
  },
  "receiverAccount":{
    "firstName":"Alan",
    "lastName":"Prueba"
  }
 }
  */