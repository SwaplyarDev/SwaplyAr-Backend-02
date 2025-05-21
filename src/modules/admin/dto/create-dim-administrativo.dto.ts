import { IsNotEmpty, IsOptional, IsString, IsEmail, IsDateString } from 'class-validator';

export class CreateDimAdministrativoDto {
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsOptional()
  @IsString()
  workHours?: string;

  @IsOptional()
  @IsString()
  entryTime?: string;

  @IsOptional()
  @IsString()
  exitTime?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  nationalId?: string;

  @IsOptional()
  @IsDateString()
  hireDate?: string;
}
