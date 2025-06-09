import { IsOptional, IsEnum, IsString, IsDateString } from 'class-validator';
import { AdminStatus } from '../entities/admin-status.enum';

export class UpdateTransactionDto {
  @IsOptional()
  @IsEnum(AdminStatus)
  status?: AdminStatus;

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