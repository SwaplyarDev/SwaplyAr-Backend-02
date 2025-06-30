import { IsPositive } from 'class-validator';

export class UpdateStarDto {
  @IsPositive()
  quantity: number;
}
