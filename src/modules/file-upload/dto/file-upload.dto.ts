import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, Max } from 'class-validator';

export class FileUploadDTO {
  @ApiProperty({ description: 'Nombre del campo', example: 'file' })
  @IsString()
  @IsNotEmpty()
  fieldName: string;
  @ApiProperty({
    description: 'Nombre original del archivo',
    example: 'archivo.pdf',
  })
  @IsString()
  @IsNotEmpty()
  originalName: string;
  @ApiProperty({ description: 'Tipo de archivo', example: 'application/pdf' })
  mimeType: string;
  @ApiProperty({ description: 'Tamaño del archivo (bytes)', example: 1000 })
  @IsNumber()
  @Max(3 * 1024 * 1024, { message: 'El tamaño máximo permitido es de 3 MB por archivo' })
  size: number;
  @ApiProperty({
    description: 'Buffer del archivo',
    example: Buffer.from('archivo.pdf'),
  })
  buffer: Buffer;
}
