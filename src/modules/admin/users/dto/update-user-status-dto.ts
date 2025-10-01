import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

export class UpdateUserStatusDto {
  @ApiProperty({
    description: 'Estado de activación del usuario (true = activo, false = inactivo)',
    example: true,
  })
  @IsBoolean()
  isActive: boolean;
}
