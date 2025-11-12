import { IsNotEmpty, IsUUID, IsEnum, IsOptional, IsString, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Status } from 'src/enum/status.enum';

export class CreateAdministracionStatusLogDto {
  @ApiProperty({ description: 'ID de la transaccion', example: '1234567890' })
  @IsUUID()
  @IsNotEmpty()
  transactionId: string;

  @ApiProperty({
    description: 'Estado del administrativo',
    example: '1234567890',
  })
  @IsEnum(Status)
  @IsNotEmpty()
  status: Status;

  @ApiProperty({
    description: 'Nota del administrativo',
    example: '1234567890',
  })
  @IsOptional()
  @IsString()
  note?: string;

  @ApiProperty({
    description: 'Causa del administrativo',
    example: '1234567890',
  })
  @IsOptional()
  @IsString()
  cause?: string;

  @ApiProperty({
    description: 'Resultado del administrativo',
    example: '1234567890',
  })
  @IsOptional()
  @IsBoolean()
  result?: boolean;

  @ApiProperty({ description: 'Transaccion swaplyar', example: '1234567890' })
  @IsOptional()
  @IsString()
  transactionSwaplyar?: string;

  @ApiProperty({ description: 'Transaccion recibida', example: '1234567890' })
  @IsOptional()
  @IsString()
  transactionReceipt?: string;

  @ApiProperty({ description: 'Nota de aprobacion', example: '1234567890' })
  @IsOptional()
  @IsString()
  approvedNote?: string;
}
