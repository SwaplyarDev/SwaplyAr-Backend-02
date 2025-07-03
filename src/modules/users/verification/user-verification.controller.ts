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
  BadRequestException
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
  ApiNotFoundResponse
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../common/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { VerificationStatus } from '../entities/user-verification.entity';
import { memoryStorage } from 'multer';
import { UserVerificationService } from './user-verification.service';

@ApiTags('User Verification')
@Controller('verification')
@ApiBearerAuth()
export class UserVerificationController {
  constructor(private readonly verificationService: UserVerificationService) {}



  //TODO : FALTA PUT (verification/upload), FALTA GET ( verification/user-validation) ,PUT (verification/verification-status), 
  @Post('upload')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ 
    summary: 'Subir documentos para verificación',
    description: 'Permite a un usuario subir las imágenes necesarias para su verificación de identidad.'
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
          description: 'Imagen del frente del documento de identidad (jpg, jpeg, png)'
        },
        document_back: {
          type: 'string',
          format: 'binary',
          description: 'Imagen del reverso del documento de identidad (jpg, jpeg, png)'
        },
        selfie_image: {
          type: 'string',
          format: 'binary',
          description: 'Selfie sosteniendo el documento (jpg, jpeg, png)'
        }
      }
    }
  })
  @ApiResponse({ 
    status: HttpStatus.CREATED, 
    description: 'Documentos subidos exitosamente',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'Imágenes de verificación subidas correctamente. Su verificación está pendiente de revisión.' },
        data: {
          type: 'object',
          properties: {
            verification_id: { type: 'string', example: 'abc123' },
            status: { type: 'string', example: 'pending' }
          }
        }
      }
    }
  })
  @ApiBearerAuth()
  @ApiUnauthorizedResponse({ description: 'No autorizado' })
  @ApiForbiddenResponse({ description: 'Acceso denegado' })
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'document_front', maxCount: 1 },
    { name: 'document_back', maxCount: 1 },
    { name: 'selfie_image', maxCount: 1 }
  ], {
    storage: memoryStorage(),
    fileFilter: (req, file, callback) => {
      if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
        return callback(new BadRequestException('Solo se permiten archivos de imagen (jpg, jpeg, png)'), false);
      }
      callback(null, true);
    },
    limits: {
      fileSize: 5 * 1024 * 1024 // 5MB
    }
  }))
  async uploadVerification(
    @Request() req,
    @UploadedFiles() files: {
      document_front?: Express.Multer.File[];
      document_back?: Express.Multer.File[];
      selfie_image?: Express.Multer.File[];
    }
  ) {
    if (!files.document_front?.[0] || !files.document_back?.[0] || !files.selfie_image?.[0]) {
      throw new BadRequestException('Se requieren tres imágenes: frente y reverso del documento, y selfie');
    }

    const userId = req.user.id;
    const verification = await this.verificationService.create(userId, files);
    
    return {
      success: true,
      message: 'Imágenes de verificación subidas correctamente. Su verificación está pendiente de revisión.',
      data: {
        verification_id: verification.verification_id,
        status: verification.verification_status
      }
    };
  }

  @ApiBearerAuth()
  @Get('status')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ 
    summary: 'Consultar estado de verificación',
    description: 'Permite a un usuario consultar el estado actual de su verificación.'
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
            submitted_at: { type: 'string', format: 'date-time' }
          }
        }
      }
    }
  })
  @ApiUnauthorizedResponse({ description: 'No autorizado' })
  @ApiNotFoundResponse({ description: 'Verificación no encontrada' })
  async checkStatus(@Request() req) {
    const userId = req.user.id;
    const verification = await this.verificationService.findByUserId(userId);
    
    return {
      success: true,
      data: {
        verification_id: verification.verification_id,
        status: verification.verification_status,
        submitted_at: verification.created_at
      }
    };
  }

  @Get('admin/list')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiOperation({ 
    summary: 'Listar verificaciones pendientes',
    description: 'Permite a los administradores listar todas las verificaciones pendientes.'
  })
  @ApiResponse({ 
    status: HttpStatus.OK,
    description: 'Lista de verificaciones pendientes',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'Verificaciones con estado PENDIENTE obtenidas correctamente' },
        count: { type: 'number', example: 1 },
        data: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              verification_id: { type: 'string' },
              users_id: { type: 'string' },
              status: { type: 'string' },
              submitted_at: { type: 'string', format: 'date-time' }
            }
          }
        }
      }
    }
  })
  @ApiUnauthorizedResponse({ description: 'No autorizado' })
  @ApiForbiddenResponse({ description: 'Acceso denegado - Se requiere rol de administrador' })
  async listPending() {
    const verifications = await this.verificationService.findPendingVerifications();
    
    return {
      success: true,
      message: 'Verificaciones con estado PENDIENTE obtenidas correctamente',
      count: verifications.length,
      data: verifications
    };
  }

  @Patch('admin/:verificationId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiOperation({ 
    summary: 'Actualizar estado de verificación',
    description: 'Permite a los administradores aprobar o rechazar una verificación.'
  })
  @ApiParam({
    name: 'verificationId',
    description: 'ID de la verificación a actualizar',
    type: 'string'
  })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['status'],
      properties: {
        status: {
          type: 'string',
          enum: [VerificationStatus.VERIFIED, VerificationStatus.REJECTED],
          description: 'Nuevo estado de la verificación'
        },
        note_rejection: {
          type: 'string',
          description: 'Motivo del rechazo (requerido si el estado es REJECTED)',
          example: 'Documento ilegible'
        }
      }
    }
  })
  @ApiResponse({ 
    status: HttpStatus.OK,
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
            note_rejection: { type: 'string', nullable: true }
          }
        }
      }
    }
  })
  @ApiUnauthorizedResponse({ description: 'No autorizado' })
  @ApiForbiddenResponse({ description: 'Acceso denegado - Se requiere rol de administrador' })
  @ApiNotFoundResponse({ description: 'Verificación no encontrada' })
  async updateStatus(
    @Param('verificationId') verificationId: string,
    @Body() updateData: { status: VerificationStatus; note_rejection?: string }
  ) {
    const verification = await this.verificationService.updateStatus(
      verificationId,
      updateData.status,
      updateData.note_rejection
    );
    
    return {
      success: true,
      message: `Verificación ${updateData.status === VerificationStatus.VERIFIED ? 'aprobada' : 'rechazada'} correctamente`,
      data: verification
    };
  }
} 