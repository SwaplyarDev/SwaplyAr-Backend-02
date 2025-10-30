import {
  Controller,
  Post,
  Get,
  Patch,
  Param,
  Body,
  UseGuards,
  Request,
  HttpStatus,
  UseInterceptors,
  UploadedFiles,
  BadRequestException,
  ParseUUIDPipe,
  Put,
  Delete,
  NotFoundException,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiCreatedResponse,
  ApiBearerAuth,
  ApiConsumes,
  ApiBody,
  ApiParam,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../common/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { VerificationStatus } from '../entities/user-verification.entity';
import { UserVerificationService } from './user-verification.service';
import { UploadFilesDto } from '@users/verification/dto/create-user-verification.dto';
import { VerificationFilesInterceptor } from '@users/interceptors/verification-files.interceptor';
import { UpdateVerificationResponseDto } from '@users/verification/dto/update-verification-response.dto';
import { UpdateVerificationDto } from './dto/update-verification.dto';
import {
  UploadFilesExtendedResponseDto,
  UploadFilesResponseDto,
} from './dto/upload-files-response.dto';
import { VerificationStatusResponseDto } from './dto/verification-status-response.dto';
import { VerificationResponseDto } from './dto/verification-response.dto';
import { DeleteVerificationResponseDto } from './dto/delete-verification-response.dto';
@Controller('verification')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class UserVerificationController {
  constructor(private readonly verificationService: UserVerificationService) {}

  @UseGuards(RolesGuard)
  @Roles('user')
  @Post('upload')
  @ApiOperation({
    summary: 'Subir documentos para verificación',
    description:
      'Permite a un usuario subir las imágenes necesarias para su verificación de identidad.',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UploadFilesDto })
  @ApiCreatedResponse({
    description: 'Documentos subidos exitosamente',
    type: UploadFilesResponseDto,
  })
  @ApiNotFoundResponse({ description: 'Usuario no encontrado.' })
  @ApiConflictResponse({
    description: 'Ya existe una solicitud de verificación pendiente para este usuario.',
  })
  @ApiForbiddenResponse({
    description: 'Autorización no permitida, solo para usuarios',
  })
  @ApiUnauthorizedResponse({
    description: 'No autorizado. Token no válido o no enviado.',
  })
  @ApiBadRequestResponse({
    description:
      'Faltan imágenes o Archivo inválido: solo se permiten imágenes en formato jpg, jpeg o png.',
  })
  @UseInterceptors(VerificationFilesInterceptor)
  async uploadVerification(
    @Request() req,
    @UploadedFiles()
    files: {
      document_front?: Express.Multer.File[];
      document_back?: Express.Multer.File[];
      selfie_image?: Express.Multer.File[];
    },
  ) {
    const userId = req.user.id;
    return this.verificationService.create(userId, files);
  }

  @UseGuards(RolesGuard)
  @Roles('user')
  @Get('status')
  @ApiOperation({
    summary: 'Consultar estado de verificación',
    description: 'Permite a un usuario consultar el estado actual de su verificación.',
  })
  @ApiOkResponse({
    description: 'Estado de verificación obtenido correctamente',
    type: VerificationStatusResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'No autorizado. Token no válido o no enviado.',
  })
  @ApiForbiddenResponse({
    description: 'Autorización no permitida, solo para usuarios',
  })
  @ApiNotFoundResponse({
    description: 'No se encontró verificación para este usuario',
  })
  async checkStatus(@Request() req) {
    const userId = req.user.id;
    const verification = await this.verificationService.findByUserId(userId);

    return {
      success: true,
      data: {
        verification_id: verification.verification_id,
        verification_status: verification.verification_status,
        submitted_at: verification.created_at,
      },
    };
  }
  @UseGuards(RolesGuard)
  @Roles('user')
  @Put('reupload')
  @ApiOperation({
    summary: 'Re-subir documentos de verificación',
    description:
      'Permite a un usuario volver a subir los documentos requeridos solo si la verificación está en estado REENVIAR DATOS.',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UploadFilesDto })
  @ApiOkResponse({
    description: 'Documentos re-subidos exitosamente',
    type: UploadFilesResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'No se encontró una verificación existente para este usuario.',
  })
  @ApiBadRequestResponse({
    description:
      'Solo es posible re-subir documentos si la verificación está en estado REENVIAR DATOS o faltan imágenes.',
  })
  @ApiForbiddenResponse({
    description: 'Autorización no permitida, solo para usuarios',
  })
  @ApiUnauthorizedResponse({
    description: 'No autorizado. Token no válido o no enviado.',
  })
  @UseInterceptors(VerificationFilesInterceptor)
  async reuploadVerification(
    @Request() req,
    @UploadedFiles()
    files: {
      document_front?: Express.Multer.File[];
      document_back?: Express.Multer.File[];
      selfie_image?: Express.Multer.File[];
    },
  ) {
    const userId = req.user.id;
    return this.verificationService.reupload(userId, files);
  }
  @UseGuards(RolesGuard)
  @Roles('admin')
  @ApiOperation({
    summary: 'Obtener una verificación por ID',
    description:
      'Permite a los administradores obtener el detalle completo de una verificación por su ID.',
  })
  @ApiOkResponse({
    description: 'Verificación obtenida correctamente',
    type: VerificationResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Verificación no encontrada para el ID proporcionado',
  })
  @ApiUnauthorizedResponse({
    description: 'No autorizado. Token no válido o no enviado',
  })
  @ApiForbiddenResponse({
    description: 'Autorización no permitida, solo para administradores',
  })
  @Get('admin/:verificationId')
  async getVerificationById(@Param('verificationId') verificationId: string) {
    const verification = await this.verificationService.findVerificationById(verificationId);

    if (!verification) {
      throw new NotFoundException(`Verification with id ${verificationId} not found`);
    }

    const latestAttempt =
      verification.attempts && verification.attempts.length > 0
        ? verification.attempts[verification.attempts.length - 1]
        : null;

    const documents = latestAttempt
      ? {
          front: latestAttempt.document_front,
          back: latestAttempt.document_back,
          selfie: latestAttempt.selfie_image,
        }
      : {
          front: verification.document_front,
          back: verification.document_back,
          selfie: verification.selfie_image,
        };

    return {
      success: true,
      message: 'Verificación obtenida correctamente',
      data: {
        id: verification.verification_id,
        user_id: verification.user?.id,
        documents,
        verification_status: verification.verification_status,
        note_rejection:
          verification.note_rejection && verification.note_rejection.trim() !== ''
            ? verification.note_rejection
            : null,
        submitted_at: verification.created_at,
        updated_at: verification.updated_at,
        verified_at: verification.verified_at ? verification.verified_at.toISOString() : null,
      },
    };
  }

  @Patch('admin/:verificationId')
  @UseGuards(RolesGuard)
  @Roles('admin')
  @ApiOperation({
    summary: 'Actualizar estado de verificación',
    description: 'Permite a los administradores aprobar, rechazar o solicitar reenvío de datos.',
  })
  @ApiParam({
    name: 'verificationId',
    description: 'ID de la verificación a actualizar (UUID)',
    type: 'string',
  })
  @ApiBody({ type: UpdateVerificationDto })
  @ApiOkResponse({
    description: 'Verificación actualizada correctamente',
    type: UpdateVerificationResponseDto,
  })
  @ApiBadRequestResponse({
    description:
      'Estado Invalido: Valores permitidos pending, verified, rejected, resend-data o ID de verificación inválido: debe ser un UUID v4 válido',
  })
  @ApiUnauthorizedResponse({
    description: ' No autorizado. Token no válido o no enviado',
  })
  @ApiForbiddenResponse({
    description: 'Autorización no permitida, solo para Administradores.',
  })
  @ApiNotFoundResponse({ description: 'Verificación no encontrada' })
  @ApiConflictResponse({
    description: 'Esta verificación ya ha sido procesada',
  })
  async updateStatus(
    @Param('verificationId', new ParseUUIDPipe({ version: '4' }))
    verificationId: string,
    @Body()
    updateData: { status: VerificationStatus; note_rejection?: string },
  ) {
    const verification = await this.verificationService.updateStatus(
      verificationId,
      updateData.status,
      updateData.note_rejection,
    );

    let message = 'Verificación procesada correctamente';

    if (updateData.status === VerificationStatus.VERIFIED) {
      message = 'Verificación aprobada correctamente';
    } else if (updateData.status === VerificationStatus.REJECTED) {
      message = 'Verificación rechazada correctamente';
    } else if (updateData.status === VerificationStatus.RESEND_DATA) {
      message = 'Se solicitó reenviar datos para la verificación';
    }

    return {
      success: true,
      message,
      data: {
        verification_id: verification.verification_id,
        status: verification.verification_status,
        note_rejection: verification.note_rejection,
      },
    };
  }

  @Delete('admin/:verificationId')
  @UseGuards(RolesGuard)
  @Roles('admin')
  @ApiOperation({
    summary: 'Eliminar una verificación',
    description: 'Permite a los administradores eliminar una verificación existente por su ID.',
  })
  @ApiParam({
    name: 'verificationId',
    description: 'ID de la verificación a eliminar (UUID)',
    type: 'string',
  })
  @ApiUnauthorizedResponse({
    description: ' No autorizado. Token no válido o no enviado',
  })
  @ApiForbiddenResponse({
    description: 'Autorización no permitida, solo para Administradores.',
  })
  @ApiOkResponse({
    description: 'Verificación eliminada correctamente',
    type: DeleteVerificationResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'No se encontró la verificación con el ID especificado',
  })
  @ApiBadRequestResponse({
    description: 'ID de verificación inválido: debe ser un UUID v4 válido',
  })
  async deleteVerification(
    @Param('verificationId', new ParseUUIDPipe({ version: '4' }))
    verificationId: string,
  ) {
    await this.verificationService.deleteVerification(verificationId);

    return {
      success: true,
      message: 'Verificación eliminada correctamente',
    };
  }

  @UseGuards(RolesGuard)
  @Roles('user')
  @Post('request-resend')
  @ApiOperation({
    summary: 'Solicitar reenvío de datos después de rechazo',
    description:
      'Permite a un usuario cambiar el estado de su verificación de RECHAZADO a REENVIAR DATOS para poder re-subir documentos.',
  })
  @ApiOkResponse({
    description: 'Solicitud de reenvío registrada correctamente',
    type: UploadFilesResponseDto,
  })
  @ApiUnauthorizedResponse({ description: 'No autorizado. Token no válido o no enviado.' })
  @ApiForbiddenResponse({ description: 'Autorización solo para usuarios' })
  @ApiNotFoundResponse({ description: 'No se encontró una verificación para este usuario' })
  @ApiBadRequestResponse({
    description: 'Solo es posible solicitar reenvío si la verificación está en estado RECHAZADO.',
  })
  async requestResend(@Request() req) {
    const userId = req.user.id;

    const verification = await this.verificationService.findByUserId(userId);

    if (!verification) {
      throw new NotFoundException('No se encontró una verificación para este usuario.');
    }

    if (verification.verification_status !== VerificationStatus.REJECTED) {
      throw new BadRequestException(
        'Solo es posible solicitar reenvío si la verificación está en estado RECHAZADO.',
      );
    }

    verification.verification_status = VerificationStatus.RESEND_DATA;
    await this.verificationService.updateStatus(
      verification.verification_id,
      VerificationStatus.RESEND_DATA,
    );

    return {
      success: true,
      message: 'Solicitud de reenvío de datos registrada correctamente',
      data: {
        verification_id: verification.verification_id,
        verification_status: verification.verification_status,
      },
    };
  }

  @UseGuards(RolesGuard)
  @Roles('user')
  @Post('validate-user')
  @ApiOperation({
    summary: 'Validar usuario si la verificación está aprobada',
    description:
      'Si la verificación del usuario autenticado se encuentra en estado APROBADO, se marcará al usuario como validado (userValidated = true).',
  })
  @ApiOkResponse({
    description: 'Usuario marcado como verificado correctamente',
    type: UploadFilesExtendedResponseDto,
  })
  @ApiUnauthorizedResponse({ description: 'No autorizado. Token no válido o no enviado.' })
  @ApiForbiddenResponse({ description: 'Autorización solo para usuarios' })
  @ApiNotFoundResponse({ description: 'No se encontró verificación para este usuario' })
  @ApiBadRequestResponse({
    description: 'La verificación no está en estado aprobado',
  })
  async validateUser(@Request() req) {
    const userId = req.user.id;

    const verification = await this.verificationService.findByUserId(userId);

    if (!verification) {
      throw new NotFoundException('No se encontró una verificación para este usuario.');
    }

    if (verification.verification_status !== VerificationStatus.VERIFIED) {
      throw new BadRequestException(
        `La verificación no está en estado aprobado. Estado actual: ${verification.verification_status}`,
      );
    }

    await this.verificationService.validateUserIfApproved(verification.verification_id);

    return {
      success: true,
      message: 'Usuario validado correctamente',
      data: {
        verification_id: verification.verification_id,
        verification_status: verification.verification_status,
        userValidated: true,
      },
    };
  }
}
