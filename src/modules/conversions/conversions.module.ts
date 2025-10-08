

import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConversionsService } from './services/conversions.service';
import { ConversionsController } from './controllers/conversions.controller';
import { CommissionsModule } from './commissions/commissions.module'; 
import { TotalsController } from './controllers/totals.controller';

@Module({
  imports: [HttpModule, CommissionsModule],
  controllers: [ConversionsController, TotalsController],
  providers: [ConversionsService],
  exports: [ConversionsService],
})
export class ConversionsModule {}
