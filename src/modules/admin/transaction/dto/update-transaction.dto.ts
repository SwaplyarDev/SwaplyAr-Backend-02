import { IsOptional, IsEnum, IsString, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Status } from 'src/enum/status.enum';

export class UpdateTransactionDto {
  @ApiProperty({ description: 'Estado de la transaccion', example: 'pending' })
  @IsOptional()
  @IsEnum(Status)
  status?: Status;

  @IsOptional()
  @ApiProperty({
    description: 'Fecha de inicio de la transaccion',
    example: '2021-01-01:00:00:00',
  })
  @IsDateString()
  beginTransaction?: Date;

  @IsOptional()
  @ApiProperty({
    description: 'Fecha de fin de la transaccion',
    example: '2021-02-01:00:00:00',
  })
  @IsDateString()
  endTransaction?: Date;

  @IsOptional()
  @ApiProperty({
    description: 'Transaccion recibida',
    example: 'https://swaplyar.com/transaction/1234567890',
  })
  @IsString()
  transferReceived?: string;
}
