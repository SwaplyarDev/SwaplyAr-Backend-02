import { AdminStatus } from 'src/enum/admin-status.enum';
import { AdministracionMaster } from '../../modules/admin/entities/administracion-master.entity';

export interface StatusHistoryResponse {
  id: string;
  transaction: AdministracionMaster;
  status: AdminStatus;
  changedAt: Date;
  message: string;
  changedByAdmin: {
    id: string;
    name: string;
  };
  changedByAdminId: string;
  additionalData?: Record<string, any>;
} 