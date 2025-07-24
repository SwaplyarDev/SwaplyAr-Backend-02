import { Injectable } from '@nestjs/common';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { Question } from './entities/question.entity';

@Injectable()
export class QuestionsService {
  private questions: Question[] = [];

  findAll(): Question[] {
    return this.questions;
  }

  findById(id: string): Question | undefined {
    return this.questions.find((question) => question.id === id);
  }

  create(createQuestionDto: CreateQuestionDto): Question {
    const newQuestion: Question = {
      id: (this.questions.length + 1).toString(),
      ...createQuestionDto,
    };
    this.questions.push(newQuestion);
    return newQuestion;
  }

  delete(id: string): boolean {
    const index = this.questions.findIndex((question) => question.id === id);
    if (index > -1) {
      this.questions.splice(index, 1);
      return true;
    }
    return false;
  }
}
