import { Injectable } from '@nestjs/common';
import { CreateAdminMasterDto } from './dto/create-admin-master.dto';
import { UpdateAdminMasterDto } from './dto/update-admin-master.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { AdminMaster } from './entities/admin-master.entity';
import { Admin, Repository } from 'typeorm';
import { DimStatus } from './entities/dim-status.entity';
import { DimAdministrativos } from './entities/dim-administrativos.entity';

@Injectable()
export class AdminMasterService {
  constructor(
    @InjectRepository(AdminMaster)
    private readonly adminMasterRepository: Repository<AdminMaster>,
    @InjectRepository(DimStatus)
    private readonly dimStatus: Repository<DimStatus>,
    @InjectRepository(DimAdministrativos)
    private readonly dimAdministrativo: Repository<DimAdministrativos>

  ){}
  
  async getTransactionInfoService() {
    return 'Ruta para obtener la informacion de las transacciones administradas por los admins';
  }
  
  async getTransactionInfoByIdService(id:string){
    //! deberia ser por id de admin para obtener las transacciones editadas por un admin
    return 'Ruta para obetener transaccion administrada por un admin por el id de la transaccion';
  }

  async updateTransactionAdminService(id: string, updateAdminMasterDto: UpdateAdminMasterDto) {
    return 'ruta para editar la administracion de un admin en una transaccion por id de la transaccion';
  }

  async createTransactionStatusService(createAdminMasterDto: CreateAdminMasterDto){
    return 'ruta para crear un status de una transaccion';
  }
  
  async getTransactionStatusService(id:string){
    return 'ruta para obtener el status de una transaccion por id de la transaccion';
  }
  
  async createVoucherService(createAdminMasterDto: CreateAdminMasterDto){
    return 'ruta para crear un voucher';
  }
}
