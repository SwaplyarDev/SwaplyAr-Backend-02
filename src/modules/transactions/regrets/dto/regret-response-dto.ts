import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class RegretDto {
  @Expose()
  @ApiProperty({ example: '375c0ae0-6f94-47f9-9585-a7bfa4f5f57c' })
  id: string;

  @Expose()
  @ApiProperty({ example: 'Pérez' })
  lastName: string;

  @Expose()
  @ApiProperty({ example: '+12456789' })
  phoneNumber: string;

  @Expose()
  @ApiProperty({ example: 'Descripción de prueba' })
  description: string;
}
