import { Status } from 'src/enum/status.enum';
import { AdministracionMaster } from '../../modules/admin/entities/administracion-master.entity';

export interface StatusHistoryResponse {
  id: string;
  administracionMaster: AdministracionMaster;
  status: Status;
  changedAt: Date;
  message: string;
  changedByAdmin: {
    id: string;
    name: string;
  };
  changedByAdminId: string;
  additionalData?: Record<string, any>;
}

export interface UserStatusHistoryResponse {
  id: string;
  status: Status;
  changedAt: Date;
  message: string;
}
