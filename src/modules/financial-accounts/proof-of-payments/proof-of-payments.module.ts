import { Module } from '@nestjs/common';
import { ProofOfPaymentsService } from './proof-of-payments.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProofOfPayment } from './entities/proof-of-payment.entity';
import { FileUploadService } from 'src/modules/file-upload/file-upload.service';
import { CloudinaryService } from 'src/service/cloudinary/cloudinary.service';

@Module({
  imports: [TypeOrmModule.forFeature([ProofOfPayment])],
  controllers: [],
  providers: [ProofOfPaymentsService,FileUploadService,CloudinaryService],
  exports:[ProofOfPaymentsService]
})
export class ProofOfPaymentsModule {}
