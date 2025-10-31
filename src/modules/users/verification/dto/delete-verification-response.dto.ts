import { ApiProperty } from '@nestjs/swagger';

export class DeleteVerificationResponseDto {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ example: 'Verificación eliminada correctamente' })
  message: string;
}
