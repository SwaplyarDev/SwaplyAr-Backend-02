import {
  Body,
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Param,
  UseInterceptors,
  ClassSerializerInterceptor,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { ContactService } from './contacts.service';
import { Contact } from './entities/contants.entity';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/uptate-contact.dto';
import { JwtAuthGuard } from 'src/common/jwt-auth.guard';
import { AdminRoleGuard } from 'src/common/guards/admin-role.guard';

@ApiTags('Contactos')
@Controller('contacts')
@ApiBearerAuth()
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  // crea un nuevo contacto
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOperation({ summary: 'Crear un nuevo contacto' })
  @ApiResponse({ status: 201, description: 'Contacto creado correctamente' })
  @ApiBody({
    description: 'Datos necesarios para crear un contacto',
    type: CreateContactDto,
    examples: {
      ejemplo1: {
        summary: 'Ejemplo de creación',
        value: {
          name: 'Dylan',
          lastname: 'Crowder',
          email: 'devdylancrowder@outlook.com',
          message: 'Hola, quiero info',
          user_id: 'abc123',
        },
      },
    },
  })
  @Post()
  async createContact(@Body() dto: CreateContactDto) {
    return this.contactService.createContact(dto);
  }

  // obtiene todos los contactos
  @ApiOperation({ summary: 'Obtener todos los contactos' })
  @ApiResponse({ status: 200, description: 'Lista de contactos' })
  @UseGuards(JwtAuthGuard /* , AdminRoleGuard */)
  @Get()
  async getAll() {
    return this.contactService.getAllContacts();
  }

  // obtiene un contacto por ID
  @ApiOperation({ summary: 'Obtener contacto por ID' })
  @ApiParam({ name: 'id', description: 'ID del contacto', type: 'string' })
  @ApiResponse({
    status: 200,
    description: 'Contacto encontrado',
    type: Contact,
  })
  @ApiResponse({ status: 404, description: 'Contacto no encontrado' })
  @UseGuards(JwtAuthGuard /*  AdminRoleGuard */)
  @Get(':id')
  async getById(@Param('id') id: string): Promise<Contact> {
    return this.contactService.getContactById(id);
  }

  // obtiene un contacto por email
  @ApiOperation({ summary: 'Obtener contacto por email' })
  @ApiParam({
    name: 'email',
    description: 'Email del contacto',
    type: 'string',
  })
  @ApiResponse({
    status: 200,
    description: 'Contacto encontrado',
    type: Contact,
  })
  @ApiResponse({ status: 404, description: 'Contacto no encontrado' })
  @UseGuards(JwtAuthGuard /* , AdminRoleGuard */)
  @Get('email/:email')
  async getByEmail(@Param('email') email: string): Promise<Contact> {
    return this.contactService.getContactByEmail(email);
  }

  // actualiza un contacto por ID
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOperation({ summary: 'Actualizar un contacto por ID' })
  @ApiParam({
    name: 'id',
    description: 'ID del contacto a actualizar',
    type: 'string',
  })
  @ApiResponse({
    status: 200,
    description: 'Contacto actualizado correctamente',
    type: Contact,
  })
  @ApiResponse({ status: 404, description: 'Contacto no encontrado' })
  @ApiBody({
    description: 'Datos a actualizar',
    type: UpdateContactDto,
    examples: {
      ejemplo1: {
        summary: 'Ejemplo de actualización',
        value: {
          message: 'Nuevo mensaje actualizado',
        },
      },
    },
  })

  //actualiza un contacto por ID
  @UseGuards(JwtAuthGuard /* , AdminRoleGuard */)
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateContactDto,
  ): Promise<Contact> {
    return this.contactService.updateContact(id, dto);
  }

  // elimina un contacto por ID
  @ApiOperation({ summary: 'Eliminar un contacto por ID' })
  @ApiParam({
    name: 'id',
    description: 'ID del contacto a eliminar',
    type: 'string',
  })
  @ApiResponse({ status: 200, description: 'Contacto eliminado correctamente' })
  @ApiResponse({ status: 404, description: 'Contacto no encontrado' })
  @UseGuards(JwtAuthGuard, AdminRoleGuard)
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.contactService.deleteContact(id);
  }
}
