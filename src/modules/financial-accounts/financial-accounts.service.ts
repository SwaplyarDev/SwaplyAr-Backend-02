import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { SenderFinancialAccount } from "./sender-financial-accounts/entities/sender-financial-account.entity";
import { Repository } from "typeorm";
import { ReceiverFinancialAccount } from "./receiver-financial-accounts/entities/receiver-financial-account.entity";

@Injectable()
export class FinancialAccountsService {
    constructor(@InjectRepository(SenderFinancialAccount)
     private readonly senderRepository : Repository<SenderFinancialAccount>,
     @InjectRepository(ReceiverFinancialAccount)
     private readonly receiverRepository : Repository<ReceiverFinancialAccount>
    ){}
  async create(createFinancialAccountDto) {
    const{senderAccount,receiverAccount} = createFinancialAccountDto;
    const data = this.senderRepository.create(senderAccount);
    const data2 = this.receiverRepository.create(receiverAccount); // lo guarda en la tabla financial accounts
   
    const sender = await this.senderRepository.save(data); // lo guarda en la tabla financial accounts
    const receiver = await this.receiverRepository.save(data2); // lo guarda en la tabla financial accounts 
    
    return {sender,receiver}; // lo guarda en la tabla financial accounts 
  
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