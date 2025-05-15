export class UpdateAdminMasterDto {
  statusId?: number;
  beginTransaction?: Date;
  endTransaction?: Date;
  administrativeId?: number;
  transferReceived?: string;
  rejectedId?: number;
  discrepancyId?: number;
  cancelledId?: number;
  approvedId?: number;
} 