import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class UploadFilesDto {
  @IsNotEmpty()
  @ApiProperty({ type: 'string', format: 'binary', description: 'Imagen del frente del documento' })
  document_front: any;

  @IsNotEmpty()
  @ApiProperty({ type: 'string', format: 'binary', description: 'Imagen del reverso del documento' })
  document_back: any;

  @IsNotEmpty()
  @ApiProperty({ type: 'string', format: 'binary', description: 'Selfie sosteniendo el documento' })
  selfie_image: any;
}
