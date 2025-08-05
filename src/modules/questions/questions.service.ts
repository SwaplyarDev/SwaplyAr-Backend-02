

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { Question } from './entities/question.entity';

@Injectable ()

export class QuestionsService {

  constructor (

    @InjectRepository (Question)
    private readonly questionRepository: Repository<Question>,

  ) {}

  findAll (): Promise <Question []> {

    return this.questionRepository.find ();

  }

  async findAllPaginated (

    page: number,
    limit: number,

  ): Promise <{ data: Question []; total: number; page: number; limit: number } > {

    const [data, total] = await this.questionRepository.findAndCount ({

    skip: (page - 1) * limit,
    take: limit,

    })
    
    return { data, total, page, limit };
    
  }

  findById (id: string): Promise <Question | null> {

    return this.questionRepository.findOne ({ where: {id}});

  }

  async create (createQuestionDto: CreateQuestionDto): Promise <Question> {

    const newQuestion = this.questionRepository.create (createQuestionDto);  
    return this.questionRepository.save (newQuestion);
  
  }

  async delete (id: string): Promise <boolean> {

    const index = await this.questionRepository.delete (id);
    
    return (index.affected ?? 0)  > 0;

  }

}

 



