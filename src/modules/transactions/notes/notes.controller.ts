import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, HttpStatus } from '@nestjs/common';
import { NotesService } from './notes.service';

@Controller('notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Post(':transactionId')
  async create(
    @Param('transactionId') transactionId: string,
    @Body() createNoteDto: any
  ) {
    try {
      return await this.notesService.create(transactionId, createNoteDto);
    } catch (error) {
      throw new HttpException(error.message, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get()
  async findAll() {
    try {
      return await this.notesService.findAll();
    } catch (error) {
      throw new HttpException('Error al obtener las notas: ' + error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      return await this.notesService.findOne(id);
    } catch (error) {
      throw new HttpException('Error al obtener la nota: ' + error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateNoteDto: any) {
    try {
      return await this.notesService.update(id, updateNoteDto);
    } catch (error) {
      throw new HttpException('Error al actualizar la nota: ' + error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      return await this.notesService.remove(id);
    } catch (error) {
      throw new HttpException('Error al eliminar la nota: ' + error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
} 