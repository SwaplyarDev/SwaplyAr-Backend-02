import { ApiProperty } from '@nestjs/swagger';

export class DeleteNoteResponseDto {
  @ApiProperty({ example: 'Nota eliminada correctamente' })
  message: string;
}
