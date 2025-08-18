import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  UserVerification,
  VerificationStatus,
} from '../entities/user-verification.entity';
import { User } from '../entities/user.entity';
import { CloudinaryService } from '../../../service/cloudinary/cloudinary.service';
import { DiscountService } from '@discounts/discounts.service';
import { CreateVerificationResponseDto } from './dto/create-verification-response.dto';

@Injectable()
export class UserVerificationService {
  constructor(
    @InjectRepository(UserVerification)
    private readonly userVerificationRepository: Repository<UserVerification>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly cloudinaryService: CloudinaryService,
    private readonly discountService: DiscountService,
  ) {}

  async create(
    userId: string,
    files: {
      document_front?: Express.Multer.File[];
      document_back?: Express.Multer.File[];
      selfie_image?: Express.Multer.File[];
    },
  ): Promise<CreateVerificationResponseDto> {
    if (
      !files.document_front?.[0] ||
      !files.document_back?.[0] ||
      !files.selfie_image?.[0]
    ) {
      throw new BadRequestException(
        'Se requieren tres imágenes: frente y reverso del documento, y selfie',
      );
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
        verification_status: VerificationStatus.PENDING,
      },
    });

    if (existingVerification) {

      return {

        success: true,
        message:
          'Ya existe una solicitud pendiente. Puede reintentar sin problemas.',
        data: null, 
      };

   }

    const folder = 'SwaplyAr/admin/user_verification';

    const frontImageUrl = await this.cloudinaryService.uploadFile(
      files.document_front[0].buffer,
      folder,
      `front_${userId}`,
    );

    const backImageUrl = await this.cloudinaryService.uploadFile(
      files.document_back[0].buffer,
      folder,
      `back_${userId}`,
    );

    const selfieImageUrl = await this.cloudinaryService.uploadFile(
      files.selfie_image[0].buffer,
      folder,
      `selfie_${userId}`,
    );

    // Crear nueva verificación
    const verification = this.userVerificationRepository.create({
      users_id: userId,
      user: user,
      document_front: frontImageUrl,
      document_back: backImageUrl,
      selfie_image: selfieImageUrl,
      verification_status: VerificationStatus.PENDING,
    });

    const savedVerification = await this.userVerificationRepository.save(verification);

    return {

      success: true,
      message: 'Imágenes de verificación subidas correctamente. Su verificación está pendiente de revisión.',

      data: {

        verification_id: savedVerification.verification_id,
        verification_status: savedVerification.verification_status,

      },

    };

  }

  async findByUserId(userId: string): Promise<UserVerification> {
    const verification = await this.userVerificationRepository.findOne({
      where: { users_id: userId },
      order: { created_at: 'DESC' },
    });

    if (!verification) {
      throw new NotFoundException(
        'No se encontró verificación para este usuario',
      );
    }

    return verification;
  }

  async findVerificationsByStatus(
    status?: VerificationStatus,
    page: number = 1,
    limit: number = 10,
  ): Promise<{ data: UserVerification[]; total: number }> {
    const whereCondition = status ? { verification_status: status } : {};

    const [data, total] = await this.userVerificationRepository.findAndCount({
      where: whereCondition,
      relations: ['user', 'user.profile'],
      order: { created_at: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return { data, total };
  }

  async findVerificationById(
    verificationId: string,
  ): Promise<UserVerification | null> {
    return this.userVerificationRepository.findOne({
      where: { verification_id: verificationId },
      relations: ['user', 'user.profile'], // Para incluir info del usuario relacionado
    });
  }

  async reupload(
    userId: string,
    files: {
      document_front?: Express.Multer.File[];
      document_back?: Express.Multer.File[];
      selfie_image?: Express.Multer.File[];
    },
  ): Promise<UserVerification> {
    // Validar archivos requeridos
    if (
      !files.document_front?.[0] ||
      !files.document_back?.[0] ||
      !files.selfie_image?.[0]
    ) {
      throw new BadRequestException(
        'Se requieren tres imágenes: frente y reverso del documento, y selfie',
      );
    }

    // Buscar verificación existente del usuario
    const verification = await this.userVerificationRepository.findOne({
      where: { users_id: userId },
      order: { created_at: 'DESC' },
    });

    if (!verification) {
      throw new NotFoundException(
        'No se encontró una verificación existente para este usuario.',
      );
    }

    // Validar que la verificación esté en estado RESEND_DATA
    if (verification.verification_status !== VerificationStatus.RESEND_DATA) {
      throw new BadRequestException(
        'Solo es posible re-subir documentos si la verificación está en estado REENVÍO DE DATOS',
      );
    }

    const folder = 'SwaplyAr/admin/user_verification';

    // Subir imágenes nuevas en paralelo
    const [frontImageUrl, backImageUrl, selfieImageUrl] = await Promise.all([
      this.cloudinaryService.uploadFile(
        files.document_front[0].buffer,
        folder,
        `front_${userId}`,
      ),
      this.cloudinaryService.uploadFile(
        files.document_back[0].buffer,
        folder,
        `back_${userId}`,
      ),
      this.cloudinaryService.uploadFile(
        files.selfie_image[0].buffer,
        folder,
        `selfie_${userId}`,
      ),
    ]);

    // Actualizar verificación
    verification.document_front = frontImageUrl;
    verification.document_back = backImageUrl;
    verification.selfie_image = selfieImageUrl;
    verification.verification_status = VerificationStatus.PENDING;
    verification.note_rejection = '';

    return this.userVerificationRepository.save(verification);
  }

  async updateStatus(
    verificationId: string,
    status: VerificationStatus,
    noteRejection?: string,
  ): Promise<UserVerification> {
    // Validar que el status sea uno de los valores del enum
    if (!Object.values(VerificationStatus).includes(status)) {
      throw new BadRequestException(
        `Estado inválido: ${status}. Valores permitidos: ${Object.values(VerificationStatus).join(', ')}`,
      );
    }

    const verification = await this.userVerificationRepository.findOne({
      where: { verification_id: verificationId },
    });

    if (!verification) {
      throw new NotFoundException('Verificación no encontrada');
    }

    const puedeActualizar = [
      VerificationStatus.PENDING,
      VerificationStatus.RESEND_DATA,
    ].includes(verification.verification_status);

    if (!puedeActualizar) {
      throw new ConflictException('Esta verificación ya ha sido procesada');
    }

    verification.verification_status = status;

    if (
      (status === VerificationStatus.REJECTED ||
        status === VerificationStatus.RESEND_DATA) &&
      noteRejection
    ) {
      verification.note_rejection = noteRejection;
    }

    if (status === VerificationStatus.VERIFIED) {
      verification.verified_at = new Date();
      const user = await this.userRepository.findOne({
        where: { id: verification.users_id },
      });

      if (user) {
        await this.discountService.assignSystemDiscount(user, 'VERIFY', 5);
      } else {
        throw new NotFoundException(
          'Usuario no encontrado. No se aplicó el descuento',
        );
      }
    }

    return this.userVerificationRepository.save(verification);
  }

  async deleteVerification(verificationId: string): Promise<void> {
    const verification = await this.userVerificationRepository.findOne({
      where: { verification_id: verificationId },
    });

    if (!verification) {
      throw new NotFoundException('Verificación no encontrada');
    }

    await this.userVerificationRepository.remove(verification);
  }
}
