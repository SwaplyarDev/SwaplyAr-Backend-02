import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { PaymentPlatformDto } from '../../dtos/payment-platform-response.dto';

export class PaymentProviderDto {
  @ApiProperty({
    example: 'c1a7f6b2-9bca-4e05-9e34-5e2f0a17d001',
  })
  @Expose()
  id: string;

  @ApiProperty({
    example: {
      id: 'a8fcf65d-1cfc-4100-b5be-ce5c014520bf',
      code: 'bank',
      title: 'Cuenta Bancaria',
      description: 'Cuenta bancaria tradicional en moneda local.',
      isActive: true,
      createdAt: '2025-01-10T13:45:00.000Z',
      updatedAt: '2025-01-10T13:45:00.000Z',
    },
  })
  @Expose()
  @Type(() => PaymentPlatformDto)
  paymentPlatform: PaymentPlatformDto;

  @ApiProperty({ example: 'Banco Galicia' })
  @Expose()
  name: string;

  @ApiProperty({ example: 'GALICIA' })
  @Expose()
  code: string;

  @ApiProperty({ example: 'AR', nullable: true })
  @Expose()
  countryCode: string;

  @ApiProperty({
    example: 'https://cdn.example.com/logos/galicia.png',
    nullable: true,
  })
  @Expose()
  logoUrl: string;

  @ApiProperty({
    example: 'both',
    description: "Puede ser 'in', 'out' o 'both'",
  })
  @Expose()
  operationType: string;

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
