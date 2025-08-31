import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';

import { CreateQualificationDto } from './dto/create-qualification.dto';
import { QualificationService } from './qualifications.service';

@ApiTags('Qualifications')
@Controller('qualifications')
export class QualificationController {
  constructor(private readonly qualificationService: QualificationService) {}

  // Obtener todas las calificaciones
  @Get()
  @ApiOperation({ summary: 'Obtener todas las calificaciones' })
  @ApiResponse({
    status: 200,
    description: 'Listado de calificaciones retornado correctamente.',
  })
  findAll() {
    return this.qualificationService.findAll();
  }

  // Obtener una calificación por ID de transacción
  @Get(':id_transaction')
  @ApiOperation({ summary: 'Obtener calificación por ID de transacción' })
  @ApiParam({ name: 'id_transaction', description: 'ID de la transacción' })
  @ApiResponse({ status: 200, description: 'Calificación encontrada.' })
  @ApiResponse({ status: 404, description: 'Calificación no encontrada.' })
  findByTransactionId(@Param('id_transaction') id: string) {
    return this.qualificationService.findByTransactionId(id);
  }

  // Crear una nueva calificación
  @Post()
  @ApiOperation({ summary: 'Crear una nueva calificación' })
  @ApiBody({ type: CreateQualificationDto })
  @ApiResponse({
    status: 201,
    description: 'Calificación creada correctamente.',
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos.' })
  create(@Body() dto: CreateQualificationDto) {
    return this.qualificationService.create(dto);
  }
}
