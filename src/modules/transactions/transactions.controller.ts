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

    return await this.transactionsService.create(createTransactionDto, {
      buffer: file.buffer,
      fieldName: file.fieldname,
      mimeType: file.mimetype,
      originalName: file.originalname,
      size: file.size,
    });
  }

  @Get()
  findAll() {
    return this.transactionsService.findAll();
  }
}
