import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpException,
  HttpStatus,
  NotFoundException,
  BadRequestException,
  UploadedFile,
  UseInterceptors,
  UnauthorizedException,
} from '@nestjs/common';
import { Req } from '@nestjs/common';
import { NotesService } from './notes.service';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiHeader,
  ApiConsumes,
} from '@nestjs/swagger';
import { TransactionsService } from '@transactions/transactions.service';
import { OtpService } from '@otp/otp.service';
import { ValidateNoteCodeDto } from './dto/validate-note-code.dto';
import { RequestNoteCodeDto } from './dto/request-note-code.dto';
import { CreateNoteDto } from './dto/create-note.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { plainToClass, plainToInstance } from 'class-transformer';
import { validate, validateOrReject } from 'class-validator';
import { UploadedFiles } from '@nestjs/common';

@ApiTags('Notas')
@Controller('notes')
export class NotesController {
  constructor(
    private readonly notesService: NotesService,
    private readonly transactionsService: TransactionsService,
    private readonly otpService: OtpService,
  ) { }

  @ApiOperation({
    summary: 'Solicitar acceso para crear una nota mediante OTP',
  })
  @ApiBody({
    schema: {
      example: {
        transactionId: 'wFHi5iOLbC',
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Código enviado con éxito al correo asociado.',

    schema: {
      example: {
        message: 'Código enviado con éxito al correo asociado.',
        code_sent: true,
      },
    },
  })
  @Post('request-access')
  async requestAccess(@Body() dto: RequestNoteCodeDto) {
    const { transactionId } = dto;
    await this.otpService.sendOtpForTransaction(transactionId);

    return {
      message: 'Código enviado con éxito al correo asociado.',
      code_sent: true,
    };
  }

  @ApiOperation({ summary: 'Verifica el código OTP para una transacción' })
  @ApiBody({
    schema: {
      example: { transaction_id: '123', code: '123' },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Código verificado y transacción retornada',

    schema: {
      example: {
        transaction: {
          id: 'uuid',
          amount: 50000,
          currency: 'COP',
          senderAccount: { id: 'uuid-sender', email: 'sender@mail.com' },
          receiverAccount: {
            id: 'uuid-receiver',
            email: 'receiver@mail.com',
            paymentMethod: { type: 'PIX' },
          },
          createdAt: '2024-01-01T00:00:00Z',
        },
      },
    },
  })

  // VERIFICA EL CODIGO OTP PARA UNA TRANSACCIÓN
  @Post('verify-code')
  async verifyNoteCode(@Body() dto: ValidateNoteCodeDto) {
    const transaction = await this.transactionsService.findOne(dto.transaction_id, {
      relations: ['senderAccount', 'receiverAccount', 'amount'],
    });

    if (!transaction) {
      throw new NotFoundException('Transacción no encontrada');
    }

    const email = transaction.senderAccount.createdBy;

    if (!email) {
      throw new BadRequestException('Email no asociado a la transacción');
    }

    const isValidOtp = await this.otpService.validateOtpForTransaction(email, dto.code);

    if (!isValidOtp) {
      throw new UnauthorizedException('Código OTP inválido o expirado');
    }

    // Solo marcar como verificada después de validar OTP
    await this.notesService.markTransactionAsVerified(dto.transaction_id);

    // Generar token para acceder a la nota
    const accessToken = this.otpService.generateOtpToken(dto.transaction_id);

    return {
      transactionId: transaction.id,
      senderName: transaction.senderAccount.firstName,
      receiverName: transaction.receiverAccount.firstName,
      amountSent: transaction.amount.amountSent,
      currency: transaction.amount.currencySent,
      noteAccessToken: accessToken,
      expiresIn: '5m',
    };
  }

  @ApiOperation({ summary: 'Crear una nota para una transacción' })
  @ApiResponse({
    status: 201,

    description: 'Nota creada correctamente',

    schema: {
      example: {
        note_id: 'uuid',
        message: 'Nota de prueba',
        img_url: 'https://url.com/nota.png',
        createdAt: '2024-01-01T00:00:00Z',
        transaction: { id: 'uuid-transaccion' },
      },
    },
  })
  @UseInterceptors(FilesInterceptor('files'))
  @ApiConsumes('multipart/form-data')
  @ApiParam({
    name: 'transactionId',
    description: 'ID de la transacción',
    example: 'uuid-transaccion',
  })
  @ApiBody({
    description: 'Datos para crear una nota con archivos opcionales (máximo 5)',
    schema: {
      type: 'object',

      properties: {
        message: { type: 'string', example: 'Pago recibido correctamente' },
        section: { type: 'string', example: 'datos_envio, datos_recepcion, monto' },
        files: {
          type: 'array',
          items: { type: 'string', format: 'binary' },
          description: 'Archivos opcionales (máximo 5)',
        },
      },

      required: ['message', 'section'],
    },
  })
  @ApiHeader({
    name: 'note-access-token',
    description: 'Token temporal devuelto por /notes/verify-code',
    required: true,
  })
  // crea una nota
  @Post(':transactionId')  
  async create(
    @Param('transactionId') transactionId: string,
    @UploadedFiles() files: Express.Multer.File[],
    @Body() createNoteDto: CreateNoteDto,
    @Req() req: Request,
  ) {
    const token = req.headers['note-access-token'] as string;

    if (!token) throw new BadRequestException('Falta el header note-access-token');

    try {
      return await this.notesService.create(transactionId, createNoteDto, token, files);
    } catch (error) {
      throw new HttpException(
        error.message || 'Error interno al crear la nota',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  // obtiene todas las notas
  @ApiOperation({ summary: 'Obtener todas las notas' })
  @ApiResponse({
    status: 200,
    description: 'Lista de notas',

    schema: {
      example: [
        {
          note_id: 'uuid',
          message: 'Nota de prueba',
          img_url: 'https://url.com/nota.png',
          createdAt: '2024-01-01T00:00:00Z',
          transaction: { id: 'uuid-transaccion' },
        },
      ],
    },
  })
  @Get()
  async findAll() {
    try {
      return await this.notesService.findAll();
    } catch (error) {
      throw new HttpException(
        'Error al obtener las notas: ' + error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @ApiOperation({ summary: 'Obtener una nota por ID' })
  @ApiResponse({
    status: 200,
    description: 'Nota encontrada',

    schema: {
      example: {
        note_id: 'uuid',
        message: 'Nota de prueba',
        img_url: 'https://url.com/nota.png',
        createdAt: '2024-01-01T00:00:00Z',
        transaction: { id: 'uuid-transaccion' },
      },
    },
  })
  @ApiParam({ name: 'id', description: 'ID de la nota', example: 'uuid' })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      return await this.notesService.findOne(id);
    } catch (error) {
      throw new HttpException(
        'Error al obtener la nota: ' + error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  @ApiOperation({ summary: 'Actualizar una nota' })
  @ApiResponse({
    status: 200,
    description: 'Nota actualizada correctamente',
    schema: {
      example: {
        note_id: 'uuid',
        message: 'Nota actualizada',
        img_url: 'https://url.com/nota.png',
        createdAt: '2024-01-01T00:00:00Z',
        transaction: { id: 'uuid-transaccion' },
      },
    },
  })
  @ApiParam({ name: 'id', description: 'ID de la nota', example: 'uuid' })
  @ApiBody({
    description: 'Datos para actualizar la nota',
    schema: {
      example: {
        message: 'Nota actualizada',
        img_url: 'https://url.com/nota.png',
      },
    },
  })
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateNoteDto: any) {
    try {
      return await this.notesService.update(id, updateNoteDto);
    } catch (error) {
      throw new HttpException(
        'Error al actualizar la nota: ' + error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  @ApiOperation({ summary: 'Eliminar una nota' })
  @ApiResponse({
    status: 200,
    description: 'Nota eliminada correctamente',
    schema: {
      example: { message: 'Nota eliminada correctamente' },
    },
  })
  @ApiParam({ name: 'id', description: 'ID de la nota', example: 'uuid' })
  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      return await this.notesService.remove(id);
    } catch (error) {
      throw new HttpException(
        'Error al eliminar la nota: ' + error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
