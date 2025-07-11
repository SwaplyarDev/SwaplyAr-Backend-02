import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { QuestionsService } from './questions.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { NotFoundException } from '@nestjs/common';
import { AdminRoleGuard } from '../../common/guards/admin-role.guard';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Question } from './entities/question.entity';

@ApiTags('Questions')
@Controller('questions')
@ApiBearerAuth()
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) { }

  @ApiOperation({ summary: 'Obtener todas las preguntas' })
  @ApiResponse({ status: 200, description: 'Preguntas obtenidas correctamente', type: [Question] })
  @Get()
  async getAllQuestions(): Promise<Question[]> {
    return this.questionsService.findAll();
  }

  @ApiOperation({ summary: 'Obtener una pregunta por ID' })
  @ApiResponse({ status: 200, description: 'Pregunta encontrada', type: Question })
  @ApiResponse({ status: 404, description: 'Pregunta no encontrada' })
  @Get(':id')
  async getQuestionById(@Param('id') id: string): Promise<Question> {
    const question = await this.questionsService.findById(id);
    if (!question) {
      throw new NotFoundException(`Pregunta con ID ${id} no encontrada`);
    }
    return question;
  }

  @ApiOperation({ summary: 'Crear una nueva pregunta (admin solo)' })
  @ApiResponse({ status: 201, description: 'Pregunta creada correctamente', type: Question })
  @UseGuards(AdminRoleGuard)
  @Post()
  async createQuestion(@Body() createQuestionDto: CreateQuestionDto): Promise<Question> {
    return this.questionsService.create(createQuestionDto);
  }

  @ApiOperation({ summary: 'Eliminar una pregunta (admin solo)' })
  @ApiResponse({ status: 204, description: 'Pregunta eliminada correctamente' })
  @ApiResponse({ status: 404, description: 'Pregunta no encontrada' })
  @UseGuards(AdminRoleGuard)
  @Delete(':id')

  async deleteQuestion(@Param('id') id: string): Promise<void> {
    const question = await this.questionsService.findById(id);
    if (!question) {
      throw new NotFoundException(`Pregunta con ID ${id} no encontrada`);
    }
    await this.questionsService.delete(id);
  }

}