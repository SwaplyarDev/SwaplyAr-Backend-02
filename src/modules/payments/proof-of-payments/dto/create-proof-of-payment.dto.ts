import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateProofOfPaymentDto {
  @ApiProperty({
    description: 'URL de la imagen del comprobante',
    example: 'https://example.com/comprobantes/123.png',
  })
  @IsString()
  @IsNotEmpty()
  imgUrl: string;

  @ApiProperty({
    description: 'ID de la transacción asociada',
    example: '29e11aa2-4f5f-45c4-aac9-52da305c5313',
  })
  @IsUUID()
  @IsNotEmpty()
  transactionId: string;
}
