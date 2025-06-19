import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RegretsService } from './regrets.service';
import { CreateRegretDto } from './dto/create-regret.dto';
import { UpdateRegretDto } from './dto/update-regret.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam } from '@nestjs/swagger';

@ApiTags('Regrets')
@Controller('regrets')
export class RegretsController {
  constructor(private readonly regretsService: RegretsService) {}

  @ApiOperation({ summary: 'Crear un arrepentimiento de transacción' })
  @ApiResponse({ status: 201, description: 'Arrepentimiento creado correctamente', schema: {
    example: {
      id: 'uuid',
      transaction_id: '123',
      last_name: 'Davila',
      email: 'nahuel@gmail.com',
      phone_number: '1234567890',
      status: 'pending',
      note: 'Nota de prueba'
    }
  }})
  @ApiBody({
    description: 'Datos para crear un arrepentimiento',
    type: CreateRegretDto,
    examples: {
      ejemplo1: {
        summary: 'Ejemplo de request',
        value: {
          transaction_id: '123',
          last_name: 'Davila',
          email: 'nahuel@gmail.com',
          phone_number: '1234567890',
          status: 'pending',
          note: 'Nota de prueba'
        }
      }
    }
  })
  @Post()
  create(@Body() createRegretDto: CreateRegretDto) {
    return this.regretsService.create(createRegretDto);
  }

  @ApiOperation({ summary: 'Obtener todos los arrepentimientos' })
  @ApiResponse({ status: 200, description: 'Lista de arrepentimientos', schema: {
    example: [
      {
        id: 'uuid',
        transaction_id: '123',
        last_name: 'Davila',
        email: 'nahuel@gmail.com',
        phone_number: '1234567890',
        status: 'pending',
        note: 'Nota de prueba'
      }
    ]
  }})
  @Get()
  findAll() {
    return this.regretsService.findAll();
  }

  @ApiOperation({ summary: 'Obtener un arrepentimiento por ID' })
  @ApiResponse({ status: 200, description: 'Arrepentimiento encontrado', schema: {
    example: {
      id: 'uuid',
      transaction_id: '123',
      last_name: 'Davila',
      email: 'nahuel@gmail.com',
      phone_number: '1234567890',
      status: 'pending',
      note: 'Nota de prueba'
    }
  }})
  @ApiParam({ name: 'id', description: 'ID del arrepentimiento', example: 'uuid' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.regretsService.findOne(id);
  }

  @ApiOperation({ summary: 'Actualizar un arrepentimiento' })
  @ApiResponse({ status: 200, description: 'Arrepentimiento actualizado correctamente', schema: {
    example: {
      id: 'uuid',
      transaction_id: '123',
      last_name: 'Davila',
      email: 'nahuel@gmail.com',
      phone_number: '1234567890',
      status: 'approved',
      note: 'Nota actualizada'
    }
  }})
  @ApiParam({ name: 'id', description: 'ID del arrepentimiento', example: 'uuid' })
  @ApiBody({
    description: 'Datos para actualizar el arrepentimiento',
    type: UpdateRegretDto,
    examples: {
      ejemplo1: {
        summary: 'Ejemplo de request',
        value: {
          transaction_id: '123',
          last_name: 'Davila',
          email: 'nahuel@gmail.com',
          phone_number: '1234567890',
          status: 'approved',
          note: 'Nota actualizada'
        }
      }
    }
  })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRegretDto: UpdateRegretDto) {
    return this.regretsService.update(id, updateRegretDto);
  }

  @ApiOperation({ summary: 'Eliminar un arrepentimiento' })
  @ApiResponse({ status: 200, description: 'Arrepentimiento eliminado correctamente', schema: {
    example: { message: 'Arrepentimiento eliminado correctamente' }
  }})
  @ApiParam({ name: 'id', description: 'ID del arrepentimiento', example: 'uuid' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.regretsService.remove(id);
  }
} 