import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConversionsService } from './services/conversions.service';
import { ConversionsController } from './controllers/conversions.controller';
import { CommissionsModule } from './commissions/commissions.module';
import { TotalsController } from './controllers/totals.controller';
import { ConversionsGateway } from './gateway/conversions.gateway';

@Module({
  imports: [HttpModule, CommissionsModule],
  controllers: [ConversionsController, TotalsController],
  providers: [ConversionsService, ConversionsGateway],
  exports: [ConversionsService],
})
export class ConversionsModule {}
