import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { plainToInstance } from 'class-transformer';
import { FileUploadDTO } from '../file-upload/dto/file-upload.dto';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async create(@Body() body: any, @UploadedFile() file: Express.Multer.File) {
    //al enviar en formdata y enviar tantos campos como se requiere, el body llega como un string
    // por eso se hace el parseo
    const parsedDto = JSON.parse(body.createTransactionDto);

    // se crea una instancia de la clase createTransactionDto
    const createTransactionDto = plainToInstance(
      CreateTransactionDto,
      parsedDto,
    );

    // Si no se envía archivo, file será undefined
    const fileData: FileUploadDTO = file
      ? {
          buffer: file.buffer,
          fieldName: file.fieldname,
          mimeType: file.mimetype,
          originalName: file.originalname,
          size: file.size,
        }
      : {
          buffer: Buffer.from(''),
          fieldName: '',
          mimeType: '',
          originalName: '',
          size: 0,
        };

    return await this.transactionsService.create(createTransactionDto, fileData);
  }

  @Get()
  findAll() {
    return this.transactionsService.findAll();
  }
}
