import { IsOptional, IsString, IsUrl } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateUserSocialsDto {
  @ApiPropertyOptional({ example: '+573001234567', description: 'Número de WhatsApp del usuario' })
  @IsOptional()
  @IsString()
  whatsappNumber?: string;

  @ApiPropertyOptional({ example: 'https://facebook.com/user', description: 'URL de Facebook' })
  @IsOptional()
  @IsUrl()
  facebook?: string;

  @ApiPropertyOptional({ example: 'https://instagram.com/user', description: 'URL de Instagram' })
  @IsOptional()
  @IsUrl()
  instagram?: string;

  @ApiPropertyOptional({ example: 'https://tiktok.com/@user', description: 'URL de TikTok' })
  @IsOptional()
  @IsUrl()
  tiktok?: string;

  @ApiPropertyOptional({ example: 'https://twitter.com/user', description: 'URL de Twitter/X' })
  @IsOptional()
  @IsUrl()
  twitterX?: string;

  @ApiPropertyOptional({ example: 'https://snapchat.com/add/user', description: 'URL de Snapchat' })
  @IsOptional()
  @IsUrl()
  snapchat?: string;

  @ApiPropertyOptional({ example: 'https://linkedin.com/in/user', description: 'URL de LinkedIn' })
  @IsOptional()
  @IsUrl()
  linkedin?: string;

  @ApiPropertyOptional({ example: 'https://youtube.com/user', description: 'URL de YouTube' })
  @IsOptional()
  @IsUrl()
  youtube?: string;

  @ApiPropertyOptional({ example: 'https://pinterest.com/user', description: 'URL de Pinterest' })
  @IsOptional()
  @IsUrl()
  pinterest?: string;
}
