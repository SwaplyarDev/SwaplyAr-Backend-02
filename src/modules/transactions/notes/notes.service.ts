

import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Note } from './entities/note.entity';
import { Transaction } from '@transactions/entities/transaction.entity';
import { CreateNoteDto } from './dto/create-note.dto';
import { OtpService } from '@otp/otp.service';
import { CloudinaryService } from 'src/service/cloudinary/cloudinary.service';

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

  async markTransactionAsVerified (transactionId: string): Promise<void> {

    const expiration = new Date();
    expiration.setMinutes (expiration.getMinutes() + 5);

    await this.transactionRepository.update(transactionId, {

      isNoteVerified: true,
      noteVerificationExpiresAt: expiration,

    });

  }

  async create (transactionId: string, createNoteDto: CreateNoteDto, token: string, file?: Express.Multer.File) {

    let payload: { transactionId: string };

    try {

      payload = this.otpService.verifyOtpToken (token);

    } catch (err) {

      throw new BadRequestException ('Token inválido o expirado');

    }

    if (payload.transactionId !== transactionId) {

      throw new BadRequestException ('El token no corresponde a esta transacción');

    }

    const transaction = await this.transactionRepository.findOne ({

    where: { id: transactionId },

    });

    if (!transaction) {

      throw new NotFoundException ('Transacción no encontrada');

    }

    if (!transaction.isNoteVerified ||

      !transaction.noteVerificationExpiresAt ||

      new Date() > transaction.noteVerificationExpiresAt

    ) {

        throw new NotFoundException (

          'El acceso para crear nota ha expirado o no está habilitado',

        );

      }

    let img_url: string | undefined;
    
    if (file) {

    try {

      img_url = await this.cloudinaryService.uploadFile (

        file.buffer,
        'notes', 
        `note-${Date.now()}`,

      );

    } catch (error) {

      throw new BadRequestException (

        'Error al subir la imagen a Cloudinary: ' + error.message,

      );

    }

    }

    const note = this.notesRepository.create ({

      ...createNoteDto,
      transaction,
      img_url,

    });

    return await this.notesRepository.save (note);

  }

  async findAll() {
    const notes = await this.notesRepository.find();
    if (!notes || notes.length === 0) {
      throw new NotFoundException('No se encontraron notas');
    }
    return notes;
  }

  async findOne (id: string) {

    const note = await this.notesRepository.findOne ({ where: { note_id: id } });
    if (!note) throw new NotFoundException ('Nota no encontrada');
    return note;

  }

  async update(id: string, updateNoteDto: any) {
    const result = await this.notesRepository.update(id, updateNoteDto);
    if (result.affected === 0)
      throw new NotFoundException('Nota no encontrada');
    return this.findOne(id);
  }

  async remove(id: string) {
    const result = await this.notesRepository.delete(id);
    if (result.affected === 0)
      throw new NotFoundException('Nota no encontrada');
    return { message: 'Nota eliminada correctamente' };
  }
}