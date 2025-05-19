import { Injectable } from '@nestjs/common';
import { CreateProofOfPaymentDto } from './dto/create-proof-of-payment.dto';
import { UpdateProofOfPaymentDto } from './dto/update-proof-of-payment.dto';
import { FileUploadDTO } from 'src/modules/file-upload/dto/file-upload.dto';
import { FileUploadService } from 'src/modules/file-upload/file-upload.service';
import { ProofOfPayment } from './entities/proof-of-payment.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ProofOfPaymentsService {
constructor(private readonly fileUploadService : FileUploadService,
  @InjectRepository(ProofOfPayment) private readonly proofOfPaypementRepository: Repository<ProofOfPayment>,
){}

  async create(file: FileUploadDTO) {
  const folder = "proof-of-payments"; //aca ira la carpeta donde se guardara la img en cloudinary

  const fileName= `proofOfPayment_${file.originalName}_${Date.now()}` // le agregamos un nombre para la img

  const imgUrl = await this.fileUploadService.uploadFile(file,folder, fileName);
  if(!imgUrl){
    throw new Error("error al subir la imagen")
  }

  const newProofOfPayment = this.proofOfPaypementRepository.create({imgUrl: imgUrl,createAt: new Date()});
  return await this.proofOfPaypementRepository.save(newProofOfPayment);
  }


}
