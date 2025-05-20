import { AdminStatus } from '../entities/admin-status.enum';

export class CreateAdministracionMasterDto {
  transactionId: string;
  administrativoId: string;
  status: AdminStatus;
  beginTransaction?: Date;
  endTransaction?: Date;
  transferReceived?: string;
} 