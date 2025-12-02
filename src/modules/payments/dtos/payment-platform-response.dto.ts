import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class PaymentPlatformDto {
  @ApiProperty({ example: 'a8fcf65d-1cfc-4100-b5be-ce5c014520bf' })
  @Expose()
  id: string;

  @ApiProperty({ example: 'bank' })
  @Expose()
  code: string;

  @ApiProperty({ example: 'Cuenta Bancaria' })
  @Expose()
  title: string;

  @ApiProperty({ example: 'Cuenta bancaria tradicional en moneda local.' })
  @Expose()
  description: string;

  @ApiProperty({ example: true })
  @Expose()
  isActive: boolean;

  @ApiProperty({ example: '2025-01-10T13:45:00.000Z' })
  @Expose()
  createdAt: Date;

  @ApiProperty({ example: '2025-01-10T13:45:00.000Z' })
  @Expose()
  updatedAt: Date;
}
