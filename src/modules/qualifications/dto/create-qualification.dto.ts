import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class CreateQualificationDto {
  @IsString()
  @IsNotEmpty()
  transaction_id: string;

  @IsInt()
  @Min(1)
  @Max(5)
  stars_amount: number;

  @IsOptional()
  @IsString()
  note?: string;
}
