import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';
import { Qualification } from './entities/qualification.entity';
import { QualificationController } from './qualifications.controller';
import { QualificationService } from './qualifications.service';
import { Transaction } from '@transactions/entities/transaction.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Qualification, Transaction])],
  controllers: [QualificationController],
  providers: [QualificationService],
})
export class QualificationModule {}
