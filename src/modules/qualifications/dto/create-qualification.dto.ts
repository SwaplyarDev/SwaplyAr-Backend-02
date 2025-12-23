import { IsInt, IsNotEmpty, IsOptional, IsString, Max, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateQualificationDto {
  @ApiProperty({
    description: 'ID de la transacción asociada',
    example: 'TX12345678',
  })
  @IsString()
  @IsNotEmpty()
  transaction_id: string;

  @ApiProperty({
    description: 'Cantidad de estrellas (1 a 5)',
    minimum: 1,
    maximum: 5,
    example: 5,
  })
  @IsInt()
  @Min(1)
  @Max(5)
  stars_amount: number;

  @ApiPropertyOptional({
    description: 'Nota adicional del usuario',
    example: 'Muy buena atención',
  })
  @IsOptional()
  @IsString()
  note?: string;
}
