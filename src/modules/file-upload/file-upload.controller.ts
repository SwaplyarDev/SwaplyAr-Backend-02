import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileUploadService } from './file-upload.service';
import { FileInterceptor } from '@nestjs/platform-express';
@Controller('files')
export class FileUploadController {
  constructor(
    private readonly fileUploadService: FileUploadService
  ) {}

  @Post("uploadImage")
  @HttpCode(200)
  @UseInterceptors(FileInterceptor('file')) // Configura el interceptor para manejar archivos
 async uploadImage(@UploadedFile() file : Express.Multer.File) {
 
  const folder = "pruebaV02";

 const img= await this.fileUploadService.uploadFile({
    buffer:file.buffer,
    fieldName:file.fieldname,
    mimeType:file.mimetype,
    originalName:file.originalname,
    size:file.size
  },folder);

  return {img:img};
  }

}
