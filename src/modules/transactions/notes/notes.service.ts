import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Note } from './entities/note.entity';
import { Transaction } from '@transactions/entities/transaction.entity';

@Injectable()
export class NotesService {
  constructor(
    @InjectRepository(Note)
    private readonly notesRepository: Repository<Note>,
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
  ) {}

  async create(transactionId: string, createNoteDto: any) {
    const transaction = await this.transactionRepository.findOne({ where: { id: transactionId } });
    if (!transaction) throw new NotFoundException('Transacción no encontrada');

    const note = this.notesRepository.create({
      ...createNoteDto,
      transaction,
    });
    return await this.notesRepository.save(note);
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