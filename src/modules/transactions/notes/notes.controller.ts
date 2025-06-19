import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, HttpStatus } from '@nestjs/common';
import { NotesService } from './notes.service';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam } from '@nestjs/swagger';

@ApiTags('Notas')
@Controller('notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @ApiOperation({ summary: 'Crear una nota para una transacción' })
  @ApiResponse({ status: 201, description: 'Nota creada correctamente', schema: {
    example: {
      note_id: 'uuid',
      message: 'Nota de prueba',
      img_url: 'https://url.com/nota.png',
      createdAt: '2024-01-01T00:00:00Z',
      transaction: { id: 'uuid-transaccion' }
    }
  }})
  @ApiParam({ name: 'transactionId', description: 'ID de la transacción', example: 'uuid-transaccion' })
  @ApiBody({
    description: 'Datos para crear la nota',
    schema: {
      example: {
        message: 'Nota de prueba',
        img_url: 'https://url.com/nota.png'
      }
    }
  })
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

  @ApiOperation({ summary: 'Obtener todas las notas' })
  @ApiResponse({ status: 200, description: 'Lista de notas', schema: {
    example: [
      {
        note_id: 'uuid',
        message: 'Nota de prueba',
        img_url: 'https://url.com/nota.png',
        createdAt: '2024-01-01T00:00:00Z',
        transaction: { id: 'uuid-transaccion' }
      }
    ]
  }})
  @Get()
  async findAll() {
    try {
      return await this.notesService.findAll();
    } catch (error) {
      throw new HttpException('Error al obtener las notas: ' + error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @ApiOperation({ summary: 'Obtener una nota por ID' })
  @ApiResponse({ status: 200, description: 'Nota encontrada', schema: {
    example: {
      note_id: 'uuid',
      message: 'Nota de prueba',
      img_url: 'https://url.com/nota.png',
      createdAt: '2024-01-01T00:00:00Z',
      transaction: { id: 'uuid-transaccion' }
    }
  }})
  @ApiParam({ name: 'id', description: 'ID de la nota', example: 'uuid' })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      return await this.notesService.findOne(id);
    } catch (error) {
      throw new HttpException('Error al obtener la nota: ' + error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @ApiOperation({ summary: 'Actualizar una nota' })
  @ApiResponse({ status: 200, description: 'Nota actualizada correctamente', schema: {
    example: {
      note_id: 'uuid',
      message: 'Nota actualizada',
      img_url: 'https://url.com/nota.png',
      createdAt: '2024-01-01T00:00:00Z',
      transaction: { id: 'uuid-transaccion' }
    }
  }})
  @ApiParam({ name: 'id', description: 'ID de la nota', example: 'uuid' })
  @ApiBody({
    description: 'Datos para actualizar la nota',
    schema: {
      example: {
        message: 'Nota actualizada',
        img_url: 'https://url.com/nota.png'
      }
    }
  })
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateNoteDto: any) {
    try {
      return await this.notesService.update(id, updateNoteDto);
    } catch (error) {
      throw new HttpException('Error al actualizar la nota: ' + error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @ApiOperation({ summary: 'Eliminar una nota' })
  @ApiResponse({ status: 200, description: 'Nota eliminada correctamente', schema: {
    example: { message: 'Nota eliminada correctamente' }
  }})
  @ApiParam({ name: 'id', description: 'ID de la nota', example: 'uuid' })
  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      return await this.notesService.remove(id);
    } catch (error) {
      throw new HttpException('Error al eliminar la nota: ' + error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
} 