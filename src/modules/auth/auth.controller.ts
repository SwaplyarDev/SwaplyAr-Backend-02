import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { RefreshDto } from './dto/refresh.dto';
import { AuthService } from '@auth/auth.service';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('token')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Renovar access token usando refresh token' })
  @ApiResponse({ status: 200, description: 'Nuevo access token generado' })
  @ApiBody({ type: RefreshDto })
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(@Body() dto: RefreshDto) {
    return this.authService.refreshAccessToken(dto.refreshToken);
  }
}
