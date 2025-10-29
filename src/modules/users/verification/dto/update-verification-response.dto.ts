import { ApiProperty } from '@nestjs/swagger';

export class UpdateVerificationResponseDataDto {
  @ApiProperty({
    description: 'Identificador de la verificación',
    example: 'f3282e57-aaa6-4263-9b17-7db1992d4d76',
  })
  verification_id: string;

  @ApiProperty({
    description: 'Estado de la verificación',
    example: 'pending',
  })
  status: string;

  @ApiProperty({
    description: 'Información de rechazo',
    example: null,
  })
  note_rejection: string;
}

export class UpdateVerificationResponseDto {
  @ApiProperty({
    description: 'Resultado de actualización',
    example: true,
  })
  success: boolean;

  @ApiProperty({
    description: 'Mensaje que indica el resultado de la operación',
    example: 'Verficiación aprobada correctamente',
  })
  message: string;

  @ApiProperty({
    description: 'Información adicional',
  })
  data: UpdateVerificationResponseDataDto;
}
