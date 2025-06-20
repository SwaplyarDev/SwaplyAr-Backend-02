import { ApiProperty } from '@nestjs/swagger';

export class FileUploadDTO {
  @ApiProperty({ description: 'Nombre del campo' , example: 'file'})
  fieldName: string;
  @ApiProperty({ description: 'Nombre original del archivo' , example: 'archivo.pdf'})
  originalName: string;
  @ApiProperty({ description: 'Tipo de archivo' , example: 'application/pdf'})
  mimeType: string;
  @ApiProperty({ description: 'Tamaño del archivo' , example: 1000})
  size: number;
  @ApiProperty({ description: 'Buffer del archivo' , example: Buffer.from('archivo.pdf')})
  buffer: Buffer;
}
