import { AdminStatus } from '../entities/admin-status.enum';
import { IsNotEmpty, IsUUID, IsEnum, IsOptional, IsString, IsBoolean } from 'class-validator';

export class CreateAdministracionStatusLogDto {
  @IsUUID()
  @IsNotEmpty()
  transactionId: string;

  @IsEnum(AdminStatus)
  @IsNotEmpty()
  status: AdminStatus;

  @IsOptional()
  @IsString()
  note?: string;

  @IsOptional()
  @IsString()
  cause?: string;

  @IsOptional()
  @IsBoolean()
  result?: boolean;

  @IsOptional()
  @IsString()
  transactionSwaplyar?: string;

  @IsOptional()
  @IsString()
  transactionReceipt?: string;

  @IsOptional()
  @IsString()
  approvedNote?: string;
}
