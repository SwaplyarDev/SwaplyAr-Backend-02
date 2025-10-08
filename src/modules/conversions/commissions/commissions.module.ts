

import { Module } from '@nestjs/common';
import { CommissionsController } from './controllers/commissions.controller';
import { CommissionsService } from './services/commissions.service';

@Module({
  controllers: [CommissionsController],
  providers: [CommissionsService],
  exports: [CommissionsService],
})
export class CommissionsModule {}


