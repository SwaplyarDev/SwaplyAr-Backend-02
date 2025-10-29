import { ApiProperty } from '@nestjs/swagger';

export class VerificationStatusDataDto {
  @ApiProperty({ example: '9e643d5d-174e-4c0c-973d-886ddc61b4fd' })
  verification_id: string;

  @ApiProperty({ example: 'pending' })
  verification_status: string;

  @ApiProperty({ example: '2025-08-22T01:35:05.634Z' })
  submitted_at: Date;
}

export class VerificationStatusResponseDto {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ type: VerificationStatusDataDto })
  data: VerificationStatusDataDto;
}
