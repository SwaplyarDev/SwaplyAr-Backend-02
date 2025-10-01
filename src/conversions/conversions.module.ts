

import { Module } from '@nestjs/common';
import { ConversionsService } from './services/conversions.service';
import { ConversionsController } from './controllers/conversions.controller';

@Module({
  imports: [],
  controllers: [ConversionsController],
  providers: [ConversionsService],
  exports: [ConversionsService],
})
export class ConversionsModule {}
