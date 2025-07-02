import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserVerification, VerificationStatus } from '../entities/user-verification.entity';
import { User } from '../entities/user.entity';
import { CloudinaryService } from '../../../service/cloudinary/cloudinary.service';

@Injectable()
export class UserVerificationService {
  constructor(
    @InjectRepository(UserVerification)
    private readonly userVerificationRepository: Repository<UserVerification>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async create(userId: string, files: {
    document_front?: Express.Multer.File[];
    document_back?: Express.Multer.File[];
    selfie_image?: Express.Multer.File[];
  }): Promise<UserVerification> {
    if (!files.document_front?.[0] || !files.document_back?.[0] || !files.selfie_image?.[0]) {
      throw new BadRequestException('Se requieren tres imágenes: frente y reverso del documento, y selfie');
    }

    // Verificar si el usuario existe
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    // Verificar si ya existe una verificación pendiente
    const existingVerification = await this.userVerificationRepository.findOne({
      where: {
        users_id: userId,
        verification_status: VerificationStatus.PENDING
      }
    });

    if (existingVerification) {
      throw new ConflictException('Ya existe una solicitud de verificación pendiente para este usuario');
    }

    const folder = 'SwaplyAr/admin/user_verification';
    
    const frontImageUrl = await this.cloudinaryService.uploadFile(
      files.document_front[0].buffer,
      folder,
      `front_${userId}`
    );

    const backImageUrl = await this.cloudinaryService.uploadFile(
      files.document_back[0].buffer,
      folder,
      `back_${userId}`
    );

    const selfieImageUrl = await this.cloudinaryService.uploadFile(
      files.selfie_image[0].buffer,
      folder,
      `selfie_${userId}`
    );

    // Crear nueva verificación
    const verification = this.userVerificationRepository.create({
      users_id: userId,
      user: user,
      document_front: frontImageUrl,
      document_back: backImageUrl,
      selfie_image: selfieImageUrl,
      verification_status: VerificationStatus.PENDING
    });

    return this.userVerificationRepository.save(verification);
  }

  async findByUserId(userId: string): Promise<UserVerification> {
    const verification = await this.userVerificationRepository.findOne({
      where: { users_id: userId },
      order: { created_at: 'DESC' }
    });

    if (!verification) {
      throw new NotFoundException('No se encontró verificación para este usuario');
    }

    return verification;
  }

  async updateStatus(
    verificationId: string,
    status: VerificationStatus,
    noteRejection?: string
  ): Promise<UserVerification> {
    const verification = await this.userVerificationRepository.findOne({
      where: { verification_id: verificationId }
    });

    if (!verification) {
      throw new NotFoundException('Verificación no encontrada');
    }

    if (verification.verification_status !== VerificationStatus.PENDING) {
      throw new ConflictException('Esta verificación ya ha sido procesada');
    }

    verification.verification_status = status;
    if (status === VerificationStatus.REJECTED && noteRejection) {
      verification.note_rejection = noteRejection;
    }
    if (status === VerificationStatus.VERIFIED) {
      verification.verified_at = new Date();
    }

    return this.userVerificationRepository.save(verification);
  }

  async findPendingVerifications(): Promise<UserVerification[]> {
    return this.userVerificationRepository.find({
      where: { verification_status: VerificationStatus.PENDING },
      relations: ['user']
    });
  }
} 