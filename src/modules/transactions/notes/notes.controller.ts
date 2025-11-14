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
  UseInterceptors,
  UnauthorizedException,
} from '@nestjs/common';
import { Req } from '@nestjs/common';
import { NotesService } from './notes.service';
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiParam,
  ApiHeader,
  ApiConsumes,
  ApiOkResponse,
  ApiCreatedResponse,
} from '@nestjs/swagger';
import { TransactionsService } from '@transactions/transactions.service';
import { OtpService } from '@otp/otp.service';
import { ValidateNoteCodeDto } from './dto/validate-note-code.dto';
import { RequestNoteCodeDto } from './dto/request-note-code.dto';
import { CreateNoteOTPDto, CreateNoteResponseDto, CreateNoteDto } from './dto/create-note.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { SendCodeResponseDto } from './dto/send-code-response.dto';
import { ValidateOTPCodeResponseDto } from './dto/validate-otp-code-response.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { DeleteNoteResponseDto } from './dto/delete-note.dto';
import { UploadedFiles } from '@nestjs/common';

@ApiTags('Notas')
@Controller('notes')
export class NotesController {
  constructor(
    private readonly notesService: NotesService,
    private readonly transactionsService: TransactionsService,
    private readonly otpService: OtpService,
  ) {}

  @ApiOperation({
    summary: 'Solicitar acceso para crear una nota mediante OTP',
  })
  @ApiBody({ type: CreateNoteOTPDto })
  @ApiOkResponse({
    description: 'Código enviado con éxito al correo asociado.',
    type: SendCodeResponseDto,
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
  @ApiBody({ type: ValidateNoteCodeDto })
  @ApiOkResponse({
    description: 'Código verificado y transacción retornada',
    type: ValidateOTPCodeResponseDto,
  })

  // VERIFICA EL CODIGO OTP PARA UNA TRANSACCIÓN
  @Post('verify-code')
  async verifyNoteCode(@Body() dto: ValidateNoteCodeDto) {
    const transaction = await this.transactionsService.findOne(dto.transaction_id, {
      relations: [
        'senderAccount',
        'senderAccount.paymentMethod',
        'receiverAccount',
        'receiverAccount.paymentMethod',
        'amount',
      ],
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

    // Respuesta (simplificada)
    // return {
    //   transactionId: transaction.id,
    //   senderName: transaction.senderAccount.firstName,
    //   receiverName: transaction.receiverAccount.firstName,
    //   amountSent: transaction.amount.amountSent,
    //   currency: transaction.amount.currencySent,
    //   noteAccessToken: accessToken,
    //   expiresIn: '5m',
    // };

    // Respuesta (completa)
    return {
      transaction,
      noteAccessToken: accessToken,
      expiresIn: '5m',
    };
  }

  @ApiOperation({ summary: 'Crear una nota para una transacción' })
  @ApiCreatedResponse({
    description: 'Nota creada correctamente',
    type: CreateNoteResponseDto,
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
  @ApiOkResponse({
    description: 'Lista de notas',
    type: [CreateNoteResponseDto]
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
  @ApiOkResponse({
    description: 'Nota encontrada',
    type: CreateNoteResponseDto,
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
  @ApiOkResponse({
    description: 'Nota actualizada correctamente',
    type: CreateNoteResponseDto,
  })
  @ApiParam({ name: 'id', description: 'ID de la nota', example: 'uuid' })
  @ApiBody({
    description: 'Datos para actualizar la nota',
    type: UpdateNoteDto,
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
  @ApiOkResponse({
    description: 'Nota eliminada correctamente',
    type: DeleteNoteResponseDto,
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
