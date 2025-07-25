import { ApiProperty } from '@nestjs/swagger';

class PaymentMethodResponseDto {
  @ApiProperty({ example: '481f1733-3a54-46d3-abfa-2f4fd2eaa0f2', description: 'ID del método de pago' })
  id: string;

  @ApiProperty({ example: 'bank', description: 'ID de la plataforma' })
  platformId: string;

  @ApiProperty({ example: 'bank', description: 'Método de pago' })
  method: string;

  @ApiProperty({ example: 'ARS', description: 'Moneda' })
  currency: string;

  @ApiProperty({ example: 'Banco Nación', description: 'Nombre del banco' })
  bankName: string;

  @ApiProperty({ example: 'CBU', description: 'Clave para enviar' })
  sendMethodKey: string;

  @ApiProperty({ example: '1234567890123456789012', description: 'Valor para enviar' })
  sendMethodValue: string;

  @ApiProperty({ example: 'DNI', description: 'Tipo de documento' })
  documentType: string;

  @ApiProperty({ example: '87654321', description: 'Valor del documento' })
  documentValue: string;
}

export class SenderResponseDto {
  @ApiProperty({ example: 'fff2437e-cb3f-48bd-bc8f-f589ecc9cc26', description: 'ID del emisor' })
  id: string;

  @ApiProperty({ example: 'Juan', description: 'Nombre' })
  firstName: string;

  @ApiProperty({ example: 'Pérez', description: 'Apellido' })
  lastName: string;

  @ApiProperty({ type: () => PaymentMethodResponseDto, description: 'Método de pago del emisor' })
  paymentMethod: PaymentMethodResponseDto;

  @ApiProperty({ example: null, description: 'Email del emisor', nullable: true })
  email: string | null;
}

export class ReceiverResponseDto {
  @ApiProperty({ example: '0af78908-2165-471f-9712-e09b21a9e475', description: 'ID del receptor' })
  id: string;

  @ApiProperty({ example: 'Ana', description: 'Nombre' })
  firstName: string;

  @ApiProperty({ example: 'García', description: 'Apellido' })
  lastName: string;

  @ApiProperty({ type: () => PaymentMethodResponseDto, description: 'Método de pago del receptor' })
  paymentMethod: PaymentMethodResponseDto;

  @ApiProperty({ example: null, description: 'Número de identificación', nullable: true })
  identificationNumber: string | null;

  @ApiProperty({ example: '1122334455', description: 'Número de teléfono' })
  phoneNumber: string;

  @ApiProperty({ example: 'ana@example.com', description: 'Email del receptor' })
  email: string;
}

export class FinancialAccountResponseDto {
  @ApiProperty({ type: () => SenderResponseDto, description: 'Datos del emisor' })
  sender: SenderResponseDto;

  @ApiProperty({ type: () => ReceiverResponseDto, description: 'Datos del receptor' })
  receiver: ReceiverResponseDto;
}
