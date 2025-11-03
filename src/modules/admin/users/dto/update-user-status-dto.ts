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

export class UpdateUserStatusResponseDto {
  @ApiProperty({
    description: 'Id del usuario',
    example: '7c6e9c4a-8f32-4d89-9a20-bf5d8a1c9f45',
  })
  userId: string;

  @ApiProperty({
    description: 'Estado de activación del usuario (true = activo, false = inactivo)',
    example: true,
  })
  isActive: boolean;
}
