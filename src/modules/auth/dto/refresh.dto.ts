import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class RefreshDto {
  @ApiProperty({
    description: 'Refresh token para renovar el access token',
    example: 'jwt.refresh.token.aqui',
  })
  @IsString()
  refreshToken: string;
}
