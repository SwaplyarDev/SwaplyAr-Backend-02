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

export class UpdateUserRoleResponseDto {
  @ApiProperty({ example: '7c6e9c4a-8f32-4d89-9a20-bf5d8a1c9f45' })
  userId: string;

  @ApiProperty({ example: 'admin' })
  role: string;
}

export class UpdateUserStatusResponseDto {
  @ApiProperty({ example: '7c6e9c4a-8f32-4d89-9a20-bf5d8a1c9f45' })
  userId: string;

  @ApiProperty({ example: 'true' })
  isActive: string;
}
