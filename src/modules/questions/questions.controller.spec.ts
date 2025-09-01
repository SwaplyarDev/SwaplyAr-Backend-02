/**
 * Test unitarios para el controlador QuestionsController (getAllQuestionsPaginated y createQuestions).
 *
 * Este archivo valida dos funcionalidades principales:
 * 1. Obtención de preguntas paginadas mediante query param.
 * 2. Creación de nuevas preguntas con validación mediante Zod.
 *
 * Se utiliza un mock de QuestionsService para testear el controlador de forma aislada,
 * validando la lógica de paginación, validación de datos y control de errores.
 */

import { Test, TestingModule } from '@nestjs/testing';
import { QuestionsController } from './questions.controller';
import { QuestionsService } from './questions.service';
import { BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { Question } from './entities/question.entity';
import { CreateQuestionDto } from './dto/create-question.dto';

describe('QuestionsController', () => {
  let controller: QuestionsController;

  let questionsService: {
    findAllPaginated: jest.Mock;
    create: jest.Mock;
  };

  beforeEach(async () => {
    questionsService = {
      findAllPaginated: jest.fn(),
      create: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [QuestionsController],

      providers: [{ provide: QuestionsService, useValue: questionsService }],
    }).compile();

    controller = module.get<QuestionsController>(QuestionsController);
  });

  describe('getAllQuestionsPaginated', () => {
    it('Debe devolver preguntas paginadas con un "page" válido', async () => {
      const mockResult = {
        data: [
          {
            id: '1',
            title: 'Pregunta demo',
            description: 'Descripción demo',
          },
        ],

        total: 1,
        page: 1,
        limit: 9,
      };

      questionsService.findAllPaginated.mockResolvedValue(mockResult);

      const result = await controller.getAllQuestionsPaginated('1');

      expect(questionsService.findAllPaginated).toHaveBeenCalledWith(1, 9);
      expect(result).toEqual(mockResult);
    });

    it('Debe corregir el valor si "page" es 0 o negativo', async () => {
      const mockResult = {
        data: [],
        total: 1,
        page: 1,
        limit: 9,
      };

      questionsService.findAllPaginated.mockResolvedValue(mockResult);

      const result = await controller.getAllQuestionsPaginated('-3');

      expect(questionsService.findAllPaginated).toHaveBeenCalledWith(1, 9);
      expect(result.page).toBe(1);
    });

    it('Debe lanzar BadRequestException si "page" no es un número', async () => {
      await expect(controller.getAllQuestionsPaginated('abc')).rejects.toThrow(BadRequestException);
    });

    it('Debe usar la página 1 si no se pasa el query param "page"', async () => {
      const mockResult = {
        data: [],
        total: 1,
        page: 1,
        limit: 9,
      };

      questionsService.findAllPaginated.mockResolvedValue(mockResult);
      const result = await controller.getAllQuestionsPaginated(undefined);
      expect(questionsService.findAllPaginated).toHaveBeenCalledWith(1, 9);
      expect(result.page).toBe(1);
    });

    it('Debe lanzar InternalServerErrorException si el servicio falla inesperadamente', async () => {
      questionsService.findAllPaginated.mockImplementation(() => {
        throw new Error('Error inesperado');
      });

      await expect(controller.getAllQuestionsPaginated('1')).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('createQuestion', () => {
    it('Debe crear una pregunta si el DTO es válido según Zod', async () => {
      const dto: CreateQuestionDto = {
        title: '¿Prueba?',
        description: 'Prueba ...',
      };

      const createdQuestion: Question = {
        id: '1',
        title: dto.title,
        description: dto.description,
      };

      questionsService.create.mockResolvedValue(createdQuestion);

      const result = await controller.createQuestion(dto);

      expect(questionsService.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual(createdQuestion);
    });

    it('Debe lanzar BadRequestException si el DTO tiene campos inválidos según Zod', async () => {
      const invalidDto = {
        title: '',
        description: '',
      };

      await expect(controller.createQuestion(invalidDto as any)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('Debe lanzar BadRequestException si el DTO contiene campos extra no permitidos', async () => {
      const invalidDto = {
        title: 'Título válido',
        description: 'Descripción válida',
        extra: 'campo no permitido',
      };

      await expect(controller.createQuestion(invalidDto as any)).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});
