import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Note } from './entities/note.entity';
import { Transaction } from '@transactions/entities/transaction.entity';
import { CreateNoteDto } from './dto/create-note.dto';
import { OtpService } from '@otp/otp.service';
import { CloudinaryService } from 'src/service/cloudinary/cloudinary.service';
import { validateMaxFiles } from 'src/common/utils/file-validation.util';

@Injectable()
export class NotesService {
  constructor(
    @InjectRepository(Note)
    private readonly notesRepository: Repository<Note>,
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    private readonly otpService: OtpService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async markTransactionAsVerified(transactionId: string): Promise<void> {
    const expiration = new Date();
    expiration.setMinutes(expiration.getMinutes() + 5);

    await this.transactionRepository.update(transactionId, {
      isNoteVerified: true,
      noteVerificationExpiresAt: expiration,
    });
  }

  async create(
    transactionId: string,
    createNoteDto: CreateNoteDto,
    token: string,
    files?: Express.Multer.File[],
  ) {
    // Verificar token OTP
    let payload: { transactionId: string };
    try {
      payload = this.otpService.verifyOtpToken(token);
    } catch (err) {
      throw new BadRequestException('Token inválido o expirado');
    }

    if (payload.transactionId !== transactionId) {
      throw new BadRequestException('Debes verificar el código para esta transacción');
    }

    // Obtener transacción y relacion note
    const transaction = await this.transactionRepository.findOne({
      where: { id: transactionId },
      relations: ['note'], // importante para chequear si ya existe
    });

    if (!transaction) {
      throw new NotFoundException('Transacción no encontrada');
    }

    //  Evitar duplicados
    if (transaction.note) {
      throw new BadRequestException('Ya existe una nota creada para esta transacción');
    }

    //  Verificar que la nota esté habilitada
    if (
      !transaction.isNoteVerified ||
      !transaction.noteVerificationExpiresAt ||
      new Date() > transaction.noteVerificationExpiresAt
    ) {
      throw new NotFoundException('El acceso para crear nota ha expirado o no está habilitado');
    }

    //  Verificar cantidad de archivos (máximo 5) y tamaño de archivo (máximo 3MB por archivo)
    validateMaxFiles(files || [], 5, 3);

    //  Subir imagen a Cloudinary si existe
    let attachments: string[] = [];
    if (files && files.length > 0) {
      try {
        for (let i = 0; i < files.length; i++) {
          const url = await this.cloudinaryService.uploadFile(
            files[i].buffer,
            'notes',
            `note-${transactionId}-${Date.now()}-${i}`,
          );
          attachments.push(url);
        }
      } catch (error) {
        throw new BadRequestException('Error al subir archivos a Cloudinary: ' + error.message);
      }
    }

    // Crear nota
    const note = this.notesRepository.create({
      ...createNoteDto,
      transaction,
      attachments,
    });

    //  Guardar nota
    const savedNote = await this.notesRepository.save(note);

    //  Asociar la nota a la transacción y guardar
    transaction.note = savedNote;
    await this.transactionRepository.save(transaction);

    return savedNote;
  }

  async findAll() {
    const notes = await this.notesRepository.find();
    if (!notes || notes.length === 0) {
      throw new NotFoundException('No se encontraron notas');
    }
    return notes;
  }

  async findOne(id: string) {
    const note = await this.notesRepository.findOne({ where: { note_id: id } });
    if (!note) throw new NotFoundException('Nota no encontrada');
    return note;
  }

  async update(id: string, updateNoteDto: any) {
    const result = await this.notesRepository.update(id, updateNoteDto);
    if (result.affected === 0) throw new NotFoundException('Nota no encontrada');
    return this.findOne(id);
  }

  async remove(id: string) {
    const result = await this.notesRepository.delete(id);
    if (result.affected === 0) throw new NotFoundException('Nota no encontrada');
    return { message: 'Nota eliminada correctamente' };
  }
}
