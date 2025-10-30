import { ApiProperty } from '@nestjs/swagger';

export class ChangedByAdminInfoDto {
  @ApiProperty({ example: 'c4b1f279-70a8-42c5-90d7-56a76feb2efg' })
  id: string;

  @ApiProperty({ example: 'Carlos' })
  name: string;
}

export class TransactionStatesDataDto {
  @ApiProperty({ example: 'c4b1f279-70a8-42c5-90d7-56a76feb2e2d' })
  id: string;

  @ApiProperty({ example: 'review_payment' })
  status: string;

  @ApiProperty({ example: '2025-08-08T17:02:04.584Z' })
  changedAt: Date;

  @ApiProperty({ example: 'Aprobación automática tras revisión' })
  message: string;

  @ApiProperty({ type: ChangedByAdminInfoDto })
  changedByAdmin: ChangedByAdminInfoDto;
}

export class TransactionStatesResponseDto {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ example: 'Historial obtenido correctamente ja' })
  message: string;

  @ApiProperty({ type: () => [TransactionStatesDataDto] })
  data: TransactionStatesDataDto[];
}
