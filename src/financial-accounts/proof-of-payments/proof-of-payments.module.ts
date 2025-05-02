import { Module } from '@nestjs/common';
import { ProofOfPaymentsService } from './proof-of-payments.service';
import { ProofOfPaymentsController } from './proof-of-payments.controller';

@Module({
  controllers: [ProofOfPaymentsController],
  providers: [ProofOfPaymentsService],
})
export class ProofOfPaymentsModule {}
