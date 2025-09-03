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
  Query,
  ParseUUIDPipe,
  Put,
  Delete,
  NotFoundException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiConsumes,
  ApiBody,
  ApiParam,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiQuery,
  ApiOkResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../common/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { VerificationStatus } from '../entities/user-verification.entity';
import { UserVerificationService } from './user-verification.service';
import {
  CreateUserVerificationDto,
  GetVerificationsQueryDto,
  UploadFilesDto,
} from '@users/dto/create-user-verification.dto';
import { VerificationFilesInterceptor } from '@users/interceptors/verification-files.interceptor';
import { GetVerificationResponseDto } from '@users/dto/verification-response.dto';
import {
  CreateVerificationResponseDto,
  VerificationDataDto,
} from './dto/create-verification-response.dto';
import { ObjectId } from 'typeorm';

@ApiTags('User Verification')
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
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Documentos subidos exitosamente',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: {
          type: 'string',
          example:
            'Imágenes de verificación subidas correctamente. Su verificación está pendiente de revisión.',
        },
        data: {
          type: 'object',
          properties: {
            verification_id: { type: 'string', example: '9e643d5d-174e-4c0c-973d-886ddc61b4fd' },
            verification_status: { type: 'string', example: 'pending' },
          },
        },
      },
    },
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
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Estado de verificación obtenido correctamente',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        data: {
          type: 'object',
          properties: {
            verification_id: { type: 'string', example: 'abc123' },
            status: { type: 'string', example: 'pending' },
            submitted_at: { type: 'string', format: 'date-time' },
          },
        },
      },
    },
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
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Documentos re-subidos exitosamente',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: {
          type: 'string',
          example:
            'Imágenes de verificación re-subidas correctamente. Su verificación está pendiente de revisión.',
        },
        data: {
          type: 'object',
          properties: {
            verification_id: { type: 'string', example: '9e643d5d-174e-4c0c-973d-886ddc61b4fd' },
            verification_status: { type: 'string', example: 'pending' },
          },
        },
      },
    },
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
  @Get('admin/list')
  @UseGuards(RolesGuard)
  @Roles('admin')
  @ApiOperation({
    summary: 'Listar verificaciones por estado',
    description:
      'Permite a los administradores listar verificaciones filtrando por estado (PENDIENTE, APROBADO, RECHAZADO, REENVIAR_DATOS).',
  })
  @ApiQuery({
    name: 'status',
    required: false,
    description:
      'Estado de verificación a filtrar. Opciones: pending, verified, rejected, resend-data',
    schema: {
      type: 'string',
      enum: ['pending', 'verified', 'rejected', 'resend-data'],
    },
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Número de página (por defecto: 1)',
    schema: { type: 'number', example: 1 },
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Cantidad de registros por página (por defecto: 10)',
    schema: { type: 'number', example: 10 },
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Verificaciones obtenidas correctamente',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'Verificaciones obtenidas correctamente' },
        page: { type: 'number', example: 1 },
        limit: { type: 'number', example: 10 },
        total: { type: 'number', example: 1 },
        totalPages: { type: 'number', example: 1 },
        data: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string', example: '9e643d5d-174e-4c0c-973d-886ddc61b4fd' },
              user_id: { type: 'string', example: 'bb34d516-4866-4302-8d4b-c3e22a2ca64b' },
              user_profile: {
                type: 'object',
                properties: {
                  firstName: { type: 'string', example: 'Oscar' },
                  lastName: { type: 'string', example: 'Padilla' },
                  email: { type: 'string', example: 'usuario@ejemplo.com' },
                },
              },
              documents: {
                type: 'object',
                properties: {
                  front: { type: 'string', example: 'https://.../front.png' },
                  back: { type: 'string', example: 'https://.../back.png' },
                  selfie: { type: 'string', example: 'https://.../selfie.png' },
                },
              },
              verification_status: { type: 'string', example: 'pending' },
              rejection_note: { type: 'string', example: null },
              submitted_at: {
                type: 'string',
                format: 'date-time',
                example: '2025-08-22T01:31:43.733Z',
              },
              updated_at: {
                type: 'string',
                format: 'date-time',
                example: '2025-08-22T01:35:05.634Z',
              },
              verified_at: { type: 'string', format: 'date-time', example: null },
            },
          },
        },
      },
    },
  })
  @ApiBadRequestResponse({
    description:
      'Parámetro inválido: el valor de "status" no es uno permitido. Debe ser uno de: pending, verified, rejected, resend-data',
  })
  @ApiUnauthorizedResponse({
    description: ' No autorizado. Token no válido o no enviado',
  })
  @ApiForbiddenResponse({
    description: 'Autorización no permitida, solo para Administradores.',
  })
  @Get('admin/list')
  async listPending(@Query() query: GetVerificationsQueryDto) {
    const { status, page = 1, limit = 10 } = query;
    const { data: verifications, total } = await this.verificationService.findVerificationsByStatus(
      status,
      page,
      limit,
    );

    const data = verifications.map((v) => {
      const latestAttempt =
        v.attempts && v.attempts.length > 0 ? v.attempts[v.attempts.length - 1] : null;

      const documents = latestAttempt
        ? {
            front: latestAttempt.document_front,
            back: latestAttempt.document_back,
            selfie: latestAttempt.selfie_image,
          }
        : {
            front: v.document_front,
            back: v.document_back,
            selfie: v.selfie_image,
          };

      return {
        id: v.verification_id,
        user_id: v.user?.id,
        user_profile: v.user?.profile
          ? {
              firstName: v.user.profile.firstName,
              lastName: v.user.profile.lastName,
              email: 'usuario@ejemplo.com',
            }
          : null,
        documents,
        verification_status: v.verification_status,
        rejection_note:
          v.note_rejection && v.note_rejection.trim() !== '' ? v.note_rejection : null,
        submitted_at: v.created_at,
        updated_at: v.updated_at,
        verified_at: v.verified_at ? v.verified_at.toISOString() : null,
      };
    });

    return {
      success: true,
      message: `Verificaciones${status ? ` con estado ${status}` : ''} obtenidas correctamente`,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      data,
    };
  }
  @UseGuards(RolesGuard)
  @Roles('admin')
  @ApiOperation({
    summary: 'Obtener una verificación por ID',
    description:
      'Permite a los administradores obtener el detalle completo de una verificación por su ID.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Verificación obtenida correctamente',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'Verificación obtenida correctamente' },
        data: {
          type: 'object',
          properties: {
            id: { type: 'string', example: '9e643d5d-174e-4c0c-973d-886ddc61b4fd' },
            user_id: { type: 'string', example: 'bb34d516-4866-4302-8d4b-c3e22a2ca64b' },
            user_profile: {
              type: 'object',
              properties: {
                firstName: { type: 'string', example: 'Oscar' },
                lastName: { type: 'string', example: 'Padilla' },
                email: { type: 'string', example: 'usuario@ejemplo.com' },
              },
            },
            documents: {
              type: 'object',
              properties: {
                front: { type: 'string', example: 'https://.../front.png' },
                back: { type: 'string', example: 'https://.../back.png' },
                selfie: { type: 'string', example: 'https://.../selfie.png' },
              },
            },
            verification_status: { type: 'string', example: 'pending' },
            rejection_note: { type: 'string', example: null },
            submitted_at: {
              type: 'string',
              format: 'date-time',
              example: '2025-08-22T01:31:43.733Z',
            },
            updated_at: {
              type: 'string',
              format: 'date-time',
              example: '2025-08-22T01:35:05.634Z',
            },
            verified_at: { type: 'string', format: 'date-time', example: null },
          },
        },
      },
    },
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

    const profile = verification.user?.profile;

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
        user_profile: profile
          ? {
              firstName: profile.firstName,
              lastName: profile.lastName,
              email: 'usuario@ejemplo.com',
            }
          : null,
        documents,
        verification_status: verification.verification_status,
        rejection_note:
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
  @ApiBody({
    description: 'Datos para actualizar el estado de la verificación',
    required: true,
    schema: {
      type: 'object',
      required: ['status'],
      properties: {
        status: {
          type: 'string',
          enum: ['verified', 'rejected', 'resend-data'],
          description: 'Nuevo estado de la verificación',
          example: 'verified',
        },
        note_rejection: {
          type: 'string',
          description:
            'Motivo del rechazo (obligatorio solo si status es "rejected o "resend-data")',
          example: 'Documento ilegible o dañado',
          nullable: true,
        },
      },
    },
  })
  @ApiOkResponse({
    description: 'Estado de verificación actualizado correctamente',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: {
          type: 'string',
          example: 'Verificación aprobada correctamente',
        },
        data: {
          type: 'object',
          properties: {
            verification_id: { type: 'string' },
            status: { type: 'string' },
            note_rejection: { type: 'string', nullable: true },
          },
        },
      },
    },
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
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: {
          type: 'string',
          example: 'Verificación eliminada correctamente',
        },
      },
    },
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
@ApiResponse({
  status: HttpStatus.OK,
  description: 'Solicitud de reenvío registrada correctamente',
  schema: {
    type: 'object',
    properties: {
      success: { type: 'boolean', example: true },
      message: { type: 'string', example: 'Solicitud de reenvío de datos registrada correctamente' },
      data: {
        type: 'object',
        properties: {
          verification_id: { type: 'string', example: '9e643d5d-174e-4c0c-973d-886ddc61b4fd' },
          verification_status: { type: 'string', example: 'resend-data' },
        },
      },
    },
  },
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
  VerificationStatus.RESEND_DATA
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
}

