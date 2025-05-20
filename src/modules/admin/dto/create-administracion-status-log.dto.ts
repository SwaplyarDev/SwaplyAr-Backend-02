import { AdminStatus } from '../entities/admin-status.enum';

export class CreateAdministracionStatusLogDto {
  transactionId: string;
  status: AdminStatus;
  note?: string;
  cause?: string;
  result?: boolean;
  transactionSwaplyar?: string;
  transactionReceipt?: string;
  approvedNote?: string;
} 