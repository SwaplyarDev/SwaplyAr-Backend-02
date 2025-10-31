import { ApiProperty } from '@nestjs/swagger';
import { TransactionStatesDataDto } from './get-transaction-states-response.dto';

export class MetaDataDto {
  @ApiProperty({ example: 0 })
  total: number;

  @ApiProperty({ example: 0 })
  page: number;

  @ApiProperty({ example: 0 })
  limit: number;

  @ApiProperty({ example: 1 })
  totalPages: number;
}

export class TransactionsStatesResponseDto {
  @ApiProperty({ type: () => [TransactionStatesDataDto] })
  data: TransactionStatesDataDto[];

  @ApiProperty({ type: () => MetaDataDto })
  meta: MetaDataDto;
}
