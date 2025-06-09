import { IsOptional, IsNumberString, IsString } from 'class-validator';

export class FilterTransactionsDto {
  @IsOptional()
  @IsString()
  where?: string; // JSON string con condiciones

  @IsOptional()
  @IsNumberString()
  take?: string;

  @IsOptional()
  @IsNumberString()
  skip?: string;
}
