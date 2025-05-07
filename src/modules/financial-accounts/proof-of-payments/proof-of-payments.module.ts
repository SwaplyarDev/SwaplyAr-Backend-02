import { Module } from '@nestjs/common';
import { ProofOfPaymentsService } from './proof-of-payments.service';
import { ProofOfPaymentsController } from './proof-of-payments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProofOfPayment } from './entities/proof-of-payment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProofOfPayment])],
  controllers: [ProofOfPaymentsController],
  providers: [ProofOfPaymentsService],
})
export class ProofOfPaymentsModule {}
