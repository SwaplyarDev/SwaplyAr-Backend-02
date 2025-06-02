import { IsString, IsEmail, IsOptional } from 'class-validator';

export class CreateRegretDto {
  @IsString()
  transaction_id: string;

  @IsString()
  last_name: string;

  @IsEmail()
  email: string;

  @IsString()
  phone_number: string;

  @IsOptional()
  @IsString()
  status?: string; // Este campo no está en la entidad, pero lo incluyo según el JSON

  @IsOptional()
  @IsString()
  note?: string;   // Este campo tampoco está en la entidad, pero lo incluyo según el JSON
} 