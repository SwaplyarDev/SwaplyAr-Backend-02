import { IsOptional, IsNumberString, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class FilterTransactionsDto {
  @ApiProperty({ description: 'Condiciones de la transaccion' , example: '{"status": "pending", "amount": 100}'})
  @IsOptional()
  @IsString()
  where?: string; // JSON string con condiciones

  @IsOptional()
  @IsNumberString()
  @ApiProperty({ description: 'Cantidad de transacciones' , example: '10'})
  take?: string;

  @IsOptional()
  @IsNumberString()
  @ApiProperty({ description: 'Cantidad de transacciones' , example: '10'})
  skip?: string;
}
