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
import { CreateUserVerificationDto, GetVerificationsQueryDto, UploadFilesDto } from '@users/dto/create-user-verification.dto';
import { VerificationFilesInterceptor } from '@users/interceptors/verification-files.interceptor';
import { GetVerificationResponseDto } from '@users/dto/verification-response.dto';

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
  description: 'Permite a un usuario subir las imágenes necesarias para su verificación de identidad.',
})
@ApiConsumes('multipart/form-data')
@ApiBody({type: UploadFilesDto})
@ApiResponse({
  status: HttpStatus.CREATED,
  description: 'Documentos subidos exitosamente',
  schema: {
    type: 'object',
    properties: {
      success: { type: 'boolean', example: true },
      message: {
        type: 'string',
        example: 'Imágenes de verificación subidas correctamente. Su verificación está pendiente de revisión.',
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
@ApiNotFoundResponse({ description: 'Usuario no encontrado.' })
@ApiConflictResponse({ description: 'Ya existe una solicitud de verificación pendiente para este usuario.' })
@ApiForbiddenResponse({ description: 'Autorización no permitida, solo para usuarios' })
@ApiUnauthorizedResponse({ description: 'No autorizado. Token no válido o no enviado.' })
@ApiBadRequestResponse({
  description: 'Faltan imágenes o Archivo inválido: solo se permiten imágenes en formato jpg, jpeg o png.',
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
  const verification = await this.verificationService.create(userId, files);

  return {
    success: true,
    message: 'Imágenes de verificación subidas correctamente. Su verificación está pendiente de revisión.',
    data: {
      verification_id: verification.verification_id,
      status: verification.verification_status,
    },
  };
}


@UseGuards(RolesGuard)
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


@UseGuards(RolesGuard)
@Roles('user')
@Put('reupload')
@ApiOperation({
  summary: 'Re-subir documentos de verificación',
  description: 'Permite a un usuario volver a subir los documentos requeridos solo si la verificación está en estado REENVIAR DATOS.',
})
@ApiConsumes('multipart/form-data')
@ApiBody({type: UploadFilesDto})
@ApiOkResponse({
  description: 'Documentos re-subidos exitosamente',
  schema: {
    type: 'object',
    properties: {
      success: { type: 'boolean', example: true },
      message: {
        type: 'string',
        example: 'Imágenes de verificación re-subidas correctamente. Su verificación está nuevamente pendiente de revisión.',
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
@ApiNotFoundResponse({ description: 'No se encontró una verificación existente para este usuario.' })
@ApiBadRequestResponse({
  description: 'Solo es posible re-subir documentos si la verificación está en estado REENVIAR DATOS o faltan imágenes.',
})
@ApiForbiddenResponse({ description: 'Autorización no permitida, solo para usuarios' })
@ApiUnauthorizedResponse({ description: 'No autorizado. Token no válido o no enviado.' })
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
  // Validar que los tres archivos estén presentes
  if (!files.document_front?.[0] || !files.document_back?.[0] || !files.selfie_image?.[0]) {
    throw new BadRequestException(
      'Se requieren tres imágenes: frente y reverso del documento, y selfie',
    );
  }

  const userId = req.user.id;
  const verification = await this.verificationService.reupload(userId, files);

  return {
    success: true,
    message: 'Imágenes de verificación re-subidas correctamente. Su verificación está nuevamente pendiente de revisión.',
    data: {
      verification_id: verification.verification_id,
      status: verification.verification_status,
    },
  };
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
  description: 'Lista de verificaciones filtradas y paginadas por estado',
  schema: {
    type: 'object',
    properties: {
      success: { type: 'boolean', example: true },
      message: {
        type: 'string',
        example: 'Verificaciones con el estado solicitado obtenidas correctamente',
      },
      page: { type: 'number', example: 1 },
  limit: { type: 'number', example: 10 },
  total:{ type: 'number', example: 20 },
  totalPages: { type: 'number', example: 2 },
      data: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            verification_id: { type: 'string', example: 'a1729f98-9987-4799-93b1-79012c6ba885' },
            users_id: { type: 'string', example: '6c2b180f-6ffe-4f0f-a275-c0a644b2eb50' },
            verification_status: {
              type: 'string',
              enum: ['pending', 'verified', 'rejected', 'resend-data'],
              example: 'verified',
            },
            created_at: {
              type: 'string',
              format: 'date-time',
              example: '2025-07-28T15:49:56.108Z',
            },
            user: {
              type: 'object',
              nullable: true,
              properties: {
                firstName: { type: 'string', example: 'Nahuel' },
                lasttName: { type: 'string', example: 'corona' },
                email: { type: 'string', example: 'coronajonhatan@gmail.com' },
                phone: { type: 'string', example: '+5491123456789' },
              },
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
  @ApiUnauthorizedResponse({ description: ' No autorizado. Token no válido o no enviado' })
  @ApiForbiddenResponse({ description: 'Autorización no permitida, solo para Administradores.' })
  @Get('admin/list')
async listPending(@Query() query: GetVerificationsQueryDto) {
  const { status, page = 1, limit = 10 } = query;

  const { data: verifications, total } = await this.verificationService.findVerificationsByStatus(
    status,
    page,
    limit,
  );

  const data = verifications.map(v => ({
    verification_id: v.verification_id,
    users_id: v.users_id,
    verification_status: v.verification_status,
    created_at: v.created_at,
    user: v.user && v.user.profile
      ? {
          firstName: v.user.profile.firstName,
          lastName: v.user.profile.lastName,
          email: v.user.profile.email,
          phone: v.user.profile.phone,
        }
      : null,
  }));

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
  description: 'Permite a los administradores obtener el detalle completo de una verificación por su ID.',
})
@ApiResponse({ type: GetVerificationResponseDto })
@ApiNotFoundResponse({ description: 'Verificación no encontrada para el ID proporcionado' })
@ApiUnauthorizedResponse({ description: 'No autorizado. Token no válido o no enviado' })
@ApiForbiddenResponse({ description: 'Autorización no permitida, solo para administradores' })
@Get('admin/:verificationId')
async getVerificationById(@Param('verificationId') verificationId: string) {
  const verification = await this.verificationService.findVerificationById(verificationId);

  if (!verification) {
    throw new NotFoundException(`Verification with id ${verificationId} not found`);
  }

  const profile = verification.user?.profile;

  return {
    success: true,
    message: 'Verificación obtenida correctamente',
    data: {
      verification_id: verification.verification_id,
      users_id: verification.users_id,
      document_front: verification.document_front,
      document_back: verification.document_back,
      selfie_image: verification.selfie_image,
      verification_status: verification.verification_status,
      note_rejection: verification.note_rejection,
      verified_at: verification.verified_at,
      created_at: verification.created_at,
      updated_at: verification.updated_at,
      user: profile
        ? {
            'firstName': profile.firstName,
            'lastName':profile.lastName,
            'email': profile.email,
            'phone': profile.phone,
            'identification': profile.identification,  
            'birthdate': profile.birthday
          }
        : null,
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
  description: 'Estado Invalido: Valores permitidos pending, verified, rejected, resend-data o ID de verificación inválido: debe ser un UUID v4 válido',
})
@ApiUnauthorizedResponse({ description: ' No autorizado. Token no válido o no enviado' })
@ApiForbiddenResponse({ description: 'Autorización no permitida, solo para Administradores.' })
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
@ApiUnauthorizedResponse({ description: ' No autorizado. Token no válido o no enviado' })
@ApiForbiddenResponse({ description: 'Autorización no permitida, solo para Administradores.' })
@ApiOkResponse({
  description: 'Verificación eliminada correctamente',
  schema: {
    type: 'object',
    properties: {
      success: { type: 'boolean', example: true },
      message: { type: 'string', example: 'Verificación eliminada correctamente' },
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
  @Param('verificationId', new ParseUUIDPipe({ version: '4' })) verificationId: string,
) {
  await this.verificationService.deleteVerification(verificationId);

  return {
    success: true,
    message: 'Verificación eliminada correctamente',
  };
}

}
