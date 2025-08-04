import { IsOptional, IsString, IsDateString } from 'class-validator';

export class UpdateUserLocationDto {
  @IsString()
  @IsOptional()
  country?: string;

  @IsString()
  @IsOptional()
  department?: string;

  @IsDateString()
  @IsOptional()
  date?: string; // string ISO que vas a convertir a Date
}
