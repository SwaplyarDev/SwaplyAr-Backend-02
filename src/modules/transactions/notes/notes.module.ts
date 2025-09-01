import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Note } from './entities/note.entity';
import { Transaction } from '@transactions/entities/transaction.entity';
import { NotesService } from './notes.service';
import { NotesController } from './notes.controller';
import { TransactionsModule } from '@transactions/transactions.module';
import { OtpModule } from '@otp/otp.module';

@Module({
  imports: [TypeOrmModule.forFeature([Note, Transaction]), OtpModule, TransactionsModule],

  controllers: [NotesController],
  providers: [NotesService],
  exports: [NotesService],
})
export class NotesModule {}
