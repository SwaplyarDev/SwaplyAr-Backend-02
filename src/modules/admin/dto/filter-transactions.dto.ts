import { IsOptional, IsNumberString } from 'class-validator';

export class FilterTransactionsDto {
  @IsOptional()
  where?: string; // JSON string con condiciones

  @IsOptional()
  @IsNumberString()
  take?: string;

  @IsOptional()
  @IsNumberString()
  skip?: string;
}
