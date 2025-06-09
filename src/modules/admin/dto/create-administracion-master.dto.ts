import { AdminStatus } from '../entities/admin-status.enum';
import { IsNotEmpty, IsUUID, IsEnum, IsOptional, IsString, IsDateString } from 'class-validator';

export class CreateAdministracionMasterDto {
  @IsUUID()
  @IsNotEmpty()
  transactionId: string;

  @IsUUID()
  @IsNotEmpty()
  administrativoId: string;

  @IsEnum(AdminStatus)
  @IsNotEmpty()
  status: AdminStatus;

  @IsOptional()
  @IsDateString()
  beginTransaction?: Date;

  @IsOptional()
  @IsDateString()
  endTransaction?: Date;

  @IsOptional()
  @IsString()
  transferReceived?: string;
}
