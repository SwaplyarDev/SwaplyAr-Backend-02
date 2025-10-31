import { ApiProperty } from '@nestjs/swagger';

export class VerificationUpdateDataDto {
  @ApiProperty({ example: '9e643d5d-174e-4c0c-973d-886ddc61b4fd' })
  verification_id: string;

  @ApiProperty({ example: 'resend-data' })
  verification_status: string;
}

export class UploadFilesResponseDto {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ example: 'Verificación obtenida correctamente' })
  message: string;

  @ApiProperty({ type: VerificationUpdateDataDto })
  data: VerificationUpdateDataDto;
}
export class VerificationUpdateDataExtendedDto extends VerificationUpdateDataDto {
  @ApiProperty({ example: 'approved' })
  declare verification_status: string;

  @ApiProperty({ example: true })
  userValidated: boolean;
}

export class UploadFilesExtendedResponseDto extends UploadFilesResponseDto {
  @ApiProperty({ type: VerificationUpdateDataExtendedDto })
  declare data: VerificationUpdateDataExtendedDto;
}
