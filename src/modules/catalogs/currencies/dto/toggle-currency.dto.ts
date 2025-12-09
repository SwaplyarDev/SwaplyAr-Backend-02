import { IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ToggleCurrencyDto {
  @ApiProperty({
    description: 'Estado activo de la moneda',
    example: false,
  })
  @IsBoolean({ message: 'isActive debe ser un valor booleano' })
  isActive: boolean;
}
