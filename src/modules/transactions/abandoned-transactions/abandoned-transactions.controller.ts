import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AbandonedTransactionsService } from './abandoned-transactions.service';
import { CreateAbandonedTransactionDto } from '../dto/create-abandoned-transaction.dto';
import { AbandonedTransaction } from '../entities/abandoned-transaction.entity';

@ApiTags('Transacciones Abandonadas')
@Controller('abandoned-transactions')
export class AbandonedTransactionsController {
  constructor(private readonly abandonedTransactionsService: AbandonedTransactionsService) {}

  @Post()
  @ApiOperation({ summary: 'Crear una nueva transacción abandonada' })
  @ApiResponse({
    status: 201,
    description: 'La transacción abandonada ha sido creada exitosamente',
    type: AbandonedTransaction
  })
  async create(@Body() createAbandonedTransactionDto: CreateAbandonedTransactionDto): Promise<AbandonedTransaction> {
    return await this.abandonedTransactionsService.create(createAbandonedTransactionDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todas las transacciones abandonadas' })
  @ApiResponse({
    status: 200,
    description: 'Lista de todas las transacciones abandonadas',
    type: [AbandonedTransaction]
  })
  async findAll(): Promise<AbandonedTransaction[]> {
    return await this.abandonedTransactionsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una transacción abandonada por ID' })
  @ApiResponse({
    status: 200,
    description: 'La transacción abandonada ha sido encontrada',
    type: AbandonedTransaction
  })
  @ApiResponse({
    status: 404,
    description: 'La transacción abandonada no fue encontrada'
  })
  async findOne(@Param('id') id: string): Promise<AbandonedTransaction> {
    return await this.abandonedTransactionsService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar una transacción abandonada' })
  @ApiResponse({
    status: 200,
    description: 'La transacción abandonada ha sido actualizada',
    type: AbandonedTransaction
  })
  @ApiResponse({
    status: 404,
    description: 'La transacción abandonada no fue encontrada'
  })
  async update(
    @Param('id') id: string,
    @Body() updateAbandonedTransactionDto: Partial<CreateAbandonedTransactionDto>
  ): Promise<AbandonedTransaction> {
    return await this.abandonedTransactionsService.update(id, updateAbandonedTransactionDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar una transacción abandonada' })
  @ApiResponse({
    status: 200,
    description: 'La transacción abandonada ha sido eliminada'
  })
  @ApiResponse({
    status: 404,
    description: 'La transacción abandonada no fue encontrada'
  })
  async remove(@Param('id') id: string): Promise<void> {
    return await this.abandonedTransactionsService.remove(id);
  }
} 