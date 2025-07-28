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
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
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
import { memoryStorage } from 'multer';
import { UserVerificationService } from './user-verification.service';
import { GetVerificationsQueryDto } from '@users/dto/create-user-verification.dto';

@ApiTags('User Verification')
@Controller('verification')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class UserVerificationController {
  constructor(private readonly verificationService: UserVerificationService) {}

  //TODO : FALTA PUT (verification/upload), FALTA GET ( verification/user-validation) ,PUT (verification/verification-status),
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('user')
  @Post('upload')
  @ApiOperation({
    summary: 'Subir documentos para verificación',
    description:
      'Permite a un usuario subir las imágenes necesarias para su verificación de identidad.',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      required: ['document_front', 'document_back', 'selfie_image'],
      properties: {
        document_front: {
          type: 'string',
          format: 'binary',
          description:
            'Imagen del frente del documento de identidad (jpg, jpeg, png)',
        },
        document_back: {
          type: 'string',
          format: 'binary',
          description:
            'Imagen del reverso del documento de identidad (jpg, jpeg, png)',
        },
        selfie_image: {
          type: 'string',
          format: 'binary',
          description: 'Selfie sosteniendo el documento (jpg, jpeg, png)',
        },
      },
    },
  })
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
            verification_id: { type: 'string', example: 'abc123' },
            status: { type: 'string', example: 'pending' },
          },
        },
      },
    },
  })
  @ApiNotFoundResponse({ description: 'Usuario no encontrado.',})
  @ApiConflictResponse({ description:'Ya existe una solicitud de verificación pendiente para este usuario.',})
  @ApiUnauthorizedResponse({ description: 'Autorización no permitida, solo para usuarios' })
  @ApiForbiddenResponse({ description: 'No autorizado. Token no válido o no enviado.' })
  @ApiBadRequestResponse({
  description: 'Faltan imágenes o Archivo inválido: solo se permiten imágenes en formato jpg, jpeg o png.',
  })
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'document_front', maxCount: 1 },
        { name: 'document_back', maxCount: 1 },
        { name: 'selfie_image', maxCount: 1 },
      ],
      {
        storage: memoryStorage(),
        fileFilter: (req, file, callback) => {
          if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return callback(
              new BadRequestException(
                'Solo se permiten archivos de imagen (jpg, jpeg, png)',
              ),
              false,
            );
          }
          callback(null, true);
        },
        limits: {
          fileSize: 5 * 1024 * 1024, // 5MB
        },
      },
    ),
  )
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
    const verification = await this.verificationService.create(userId, files);

    return {
      success: true,
      message:
        'Imágenes de verificación subidas correctamente. Su verificación está pendiente de revisión.',
      data: {
        verification_id: verification.verification_id,
        status: verification.verification_status,
      },
    };
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('user')
  @Get('status')
  @ApiOperation({
  summary: 'Consultar estado de verificación',
  description:
    'Permite a un usuario consultar el estado actual de su verificación.',
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
  @ApiUnauthorizedResponse({ description: 'No autorizado. Token no válido o no enviado.' })
  @ApiForbiddenResponse({ description: 'Autorización no permitida, solo para usuarios' })
  @ApiNotFoundResponse({
  description:
    'No se encontró verificación para este usuario',
  })
  async checkStatus(@Request() req) {
  const userId = req.user.id;
  const verification = await this.verificationService.findByUserId(userId);

  return {
    success: true,
    data: {
      verification_id: verification.verification_id,
      status: verification.verification_status,
      submitted_at: verification.created_at,
    },
  };
}


  @Get('admin/list')
  @UseGuards(JwtAuthGuard, RolesGuard)
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
  @ApiResponse({
  status: HttpStatus.OK,
  description: 'Lista de verificaciones filtradas por estado',
  schema: {
    type: 'object',
    properties: {
      success: { type: 'boolean', example: true },
      message: {
        type: 'string',
        example:
          'Verificaciones con el estado solicitado obtenidas correctamente',
      },
      count: { type: 'number', example: 2 },
      data: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            verification_id: { type: 'string', example: 'uuid' },
            users_id: { type: 'string', example: 'uuid' },
            document_front: { type: 'string', example: 'https://...' },
            document_back: { type: 'string', example: 'https://...' },
            selfie_image: { type: 'string', example: 'https://...' },
            verification_status: {
              type: 'string',
              enum: ['pending', 'verified', 'rejected', 'resend-data'],
              example: 'pending',
            },
            note_rejection: {
              type: 'string',
              nullable: true,
              example: null,
            },
            verified_at: {
              type: 'string',
              format: 'date-time',
              nullable: true,
              example: null,
            },
            created_at: {
              type: 'string',
              format: 'date-time',
              example: '2025-07-28T15:01:01.497Z',
            },
            updated_at: {
              type: 'string',
              format: 'date-time',
              example: '2025-07-28T15:01:01.497Z',
            },
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
  @ApiUnauthorizedResponse({ description: 'Autorización no permitida, solo para Administradores' })
  @ApiForbiddenResponse({ description: 'No autorizado. Token no válido o no enviado.' })
  async listPending(@Query() query: GetVerificationsQueryDto) {
  const verifications =
    await this.verificationService.findVerificationsByStatus(query.status);

  return {
    success: true,
    message: `Verificaciones${
      query.status ? ` con estado ${query.status}` : ''
    } obtenidas correctamente`,
    count: verifications.length,
    data: verifications,
  };
}


@Patch('admin/:verificationId')
@UseGuards(JwtAuthGuard, RolesGuard)
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
      message: { type: 'string', example: 'Verificación aprobada correctamente' },
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
  description: 'ID de verificación inválido: debe ser un UUID v4 válido',
})
@ApiUnauthorizedResponse({ description: 'Autorización no permitida, solo para Administradores' })
@ApiForbiddenResponse({ description: 'No autorizado. Token no válido o no enviado.' })
@ApiNotFoundResponse({ description: 'Verificación no encontrada' })
@ApiConflictResponse({ description: 'Esta verificación ya ha sido procesada' })
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

}
