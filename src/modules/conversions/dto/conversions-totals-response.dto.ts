import { ApiProperty } from '@nestjs/swagger';
import { ConversionResponseDto } from './conversions-response.dto';
import { CommissionResponseDto } from '../commissions/dto/commissions-response.dto';

export class ConversionTotalsResponseDto extends ConversionResponseDto {
  @ApiProperty({
    type: CommissionResponseDto,
    description: 'Detalles de la comisión aplicada a la conversión.',
  })
  commission: CommissionResponseDto | null;

  @ApiProperty({
    example: 73.44,
    description: 'Monto final recibido después de aplicar la conversión y la comisión.',
  })
  totalReceived: number;

  @ApiProperty({
    example: 'PayPal USD',
    description: 'Plataforma o medio de pago origen.',
  })
  fromPlatform: string;

  @ApiProperty({
    example: 'Payoneer EUR',
    description: 'Plataforma o medio de pago destino.',
  })
  toPlatform: string;
}
