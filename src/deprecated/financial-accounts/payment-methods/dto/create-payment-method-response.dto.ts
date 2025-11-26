import { ApiProperty } from '@nestjs/swagger';

export class PixDataDto {
  @ApiProperty({
    description: 'Moneda utilizada',
    example: 'ARS',
  })
  currency: string;

  @ApiProperty({
    description: 'Nombre del banco',
    example: 'Banco Nación',
  })
  bankName: string;

  @ApiProperty({
    description: 'Tipo de dato requerido para enviar o identificar la cuenta del usuario',
    example: 'CBU',
  })
  sendMethodKey: string;

  @ApiProperty({
    description:
      'Valor asociado al método de envío seleccionado, es decir, el número o identificador de la cuenta según el tipo elegido',
    example: '1234567890123456789012',
  })
  sendMethodValue: string;

  @ApiProperty({
    description: 'Tipo de documento',
    example: 'DNI',
  })
  documentType: string;

  @ApiProperty({
    description: 'Número de documento',
    example: '42544654',
  })
  documentValue: string;
}

export class BankDataDto {
  @ApiProperty({
    description: 'Moneda utilizada',
    example: 'ARS',
  })
  currency: string;

  @ApiProperty({
    description: 'Nombre del banco',
    example: 'Banco Nación',
  })
  bankName: string;

  @ApiProperty({
    description: 'Tipo de dato requerido para enviar o identificar la cuenta del usuario',
    example: 'CBU',
  })
  sendMethodKey: string;

  @ApiProperty({
    description:
      'Valor asociado al método de envío seleccionado, es decir, el número o identificador de la cuenta según el tipo elegido',
    example: '1234567890123456789012',
  })
  sendMethodValue: string;

  @ApiProperty({
    description: 'Tipo de documento',
    example: 'DNI',
  })
  documentType: string;

  @ApiProperty({
    description: 'Número de documento',
    example: '42544654',
  })
  documentValue: string;
}

export class TypePixDataDto {
  @ApiProperty({
    description: 'Identificador único de pix',
    example: 'uuid',
  })
  id: string;

  @ApiProperty({
    description: 'Identificador único del banco virtual',
    example: 'uuid-virtual-bank',
  })
  virtualBankId: string;

  @ApiProperty({
    description: 'Clave del pix',
    example: 'clavePix',
  })
  pixKey: string;

  @ApiProperty({
    description: 'Valor del pix',
    example: 'valorPix',
  })
  pixValue: string;

  @ApiProperty({
    description: 'Valor del cpf',
    example: '12345678990',
  })
  cpf: string;
}

export class CreatePaymentMethodResponseDto {
  @ApiProperty({
    description: 'Identificador único de método de pago',
    example: 'uuid',
  })
  id: string;

  @ApiProperty({
    description: 'Identificador único de plataforma de banco',
    example: 'bank',
  })
  platformId: string;

  @ApiProperty({
    description: 'Método de pago',
    example: 'bank',
  })
  method: string;

  @ApiProperty({
    type: BankDataDto,
  })
  bank: BankDataDto;
}

export class TypeBankDataDto {
  @ApiProperty({
    description: 'Identificador único de banco',
    example: 'uuid',
  })
  id: string;

  @ApiProperty({
    description: 'Moneda utilizada',
    example: 'ARS',
  })
  currency: string;

  @ApiProperty({
    description: 'Nombre del banco',
    example: 'Banco Nación',
  })
  bankName: string;

  @ApiProperty({
    description: 'Tipo de dato requerido para enviar o identificar la cuenta del usuario',
    example: 'CBU',
  })
  sendMethodKey: string;

  @ApiProperty({
    description:
      'Valor asociado al método de envío seleccionado, es decir, el número o identificador de la cuenta según el tipo elegido',
    example: '1234567890123456789012',
  })
  sendMethodValue: string;

  @ApiProperty({
    description: 'Tipo de documento',
    example: 'DNI',
  })
  documentType: string;

  @ApiProperty({
    description: 'Número de documento',
    example: '42544654',
  })
  documentValue: string;
}
