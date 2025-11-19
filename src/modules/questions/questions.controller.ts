import {
  Body,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { QuestionsService } from './questions.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { NotFoundException } from '@nestjs/common';
import { AdminRoleGuard } from '../../common/guards/admin-role.guard';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiBody,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { Question } from './entities/question.entity';
import { JwtAuthGuard } from '../../common/jwt-auth.guard';
import { createQuestionSchema, deleteQuestionSchema } from './validation/question.schema';
import { BadRequestException } from '@nestjs/common';

@ApiTags('Questions')
@Controller('questions')
@ApiBearerAuth()
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) {}

  @ApiOperation({ summary: 'Obtener todas las preguntas' })
  @ApiOkResponse({
    description: 'Preguntas obtenidas correctamente',
    type: [Question],
  })
  @Get()
  async getAllQuestions(): Promise<Question[]> {
    return this.questionsService.findAll();
  }

  @ApiOperation({ summary: 'Obtener todas las preguntas por página' })
  @ApiOkResponse({
    description: 'Preguntas obtenidas correctamente por página',
    type: [Question],
  })
  @ApiBadRequestResponse({
    description: 'El parámetro "page" debe ser un número',
  })
  @ApiResponse({ description: 'Error al obtener las preguntas paginadas' })
  @Get('paginated')
  async getAllQuestionsPaginated(
    @Query('page') page: string = '1',
  ): Promise<{ data: Question[]; total: number; page: number; limit: number }> {
    try {
      const pageNumber = parseInt(page, 10);

      if (isNaN(pageNumber)) {
        throw new BadRequestException('El parámetro "page" debe ser un número válido');
      }

      const currentPage = pageNumber <= 0 ? 1 : pageNumber;
      const limit = 9;
      return await this.questionsService.findAllPaginated(currentPage, limit);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }

      throw new InternalServerErrorException('Error al obtener las preguntas paginadas');
    }
  }

  @ApiOperation({ summary: 'Obtener una pregunta por ID' })
  @ApiOkResponse({
    description: 'Pregunta encontrada',
    type: Question,
  })
  @ApiNotFoundResponse({ description: 'Pregunta no encontrada' })
  @Get(':id')
  async getQuestionById(@Param('id') id: string): Promise<Question> {
    const question = await this.questionsService.findById(id);

    if (!question) {
      throw new NotFoundException(`Pregunta con ID ${id} no encontrada`);
    }

    return question;
  }

  @ApiOperation({ summary: 'Crear una nueva pregunta (admin solo)' })
  @ApiCreatedResponse({
    description: 'Pregunta creada correctamente',
    type: Question,
  })
  @ApiBody({ type: CreateQuestionDto })
  @UseGuards(JwtAuthGuard, AdminRoleGuard)
  @Post()
  async createQuestion(@Body() body: CreateQuestionDto): Promise<Question> {
    const result = createQuestionSchema.safeParse(body);

    if (!result.success) {
      const isStrictError = result.error.issues.some((issue) => issue.code === 'unrecognized_keys');

      const message = isStrictError
        ? "Solo se aceptan los campos 'title' y 'description'"
        : result.error.issues.map((err) => err.message).join(', ');

      throw new BadRequestException(message);
    }

    return this.questionsService.create(result.data);
  }

  // @Post()
  // async createQuestion(@Body() body: CreateQuestionDto): Promise<Question> {
  //   const result = createQuestionSchema.safeParse(body);
  //   if (!result.success) {
  //     const message = result.error.issues.map((err) => err.message).join(', ');
  //     throw new BadRequestException(message);
  //   }

  //   return this.questionsService.create(result.data);
  // }

  @ApiOperation({ summary: 'Eliminar una pregunta (admin solo)' })
  @ApiNoContentResponse({ description: 'Pregunta eliminada correctamente' })
  @ApiNotFoundResponse({ description: 'Pregunta no encontrada' })
  @UseGuards(JwtAuthGuard, AdminRoleGuard)
  @Delete(':id')
  async deleteQuestion(@Param('id') id: string): Promise<void> {
    const result = deleteQuestionSchema.safeParse({ id });

    if (!result.success) {
      const message = result.error.issues.map((err) => err.message).join(', ');
      throw new BadRequestException(message);
    }

    const question = await this.questionsService.findById(id);

    if (!question) {
      throw new NotFoundException(`Pregunta con ID ${id} no encontrada`);
    }

    await this.questionsService.delete(id);
  }

  // @Delete(':id')

  //  async deleteQuestion(@Param('id') id: string): Promise<void> {
  //   const question = await this.questionsService.findById(id);
  //   if (!question) {
  //     throw new NotFoundException(`Pregunta con ID ${id} no encontrada`);
  //   }
  //   await this.questionsService.delete(id);
  // }
}
