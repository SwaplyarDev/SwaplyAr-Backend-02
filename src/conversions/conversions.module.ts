

import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConversionsService } from './services/conversions.service';
import { ConversionsController } from './controllers/conversions.controller';

@Module({
  imports: [HttpModule],
  controllers: [ConversionsController],
  providers: [ConversionsService],
  exports: [ConversionsService],
})
export class ConversionsModule {}
