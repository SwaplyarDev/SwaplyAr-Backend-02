import { ApiProperty } from '@nestjs/swagger';

export class SendCodeResponseDto {
  @ApiProperty({ example: 'Código enviado con éxito al correo asociado.' })
  message: string;

  @ApiProperty({ example: true })
  code_sent: boolean;
}
