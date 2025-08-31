import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Contact } from './entities/contants.entity';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/uptate-contact.dto';
import { UsersService } from '@users/users.service';
@Injectable()
export class ContactService {
  constructor(
    @InjectRepository(Contact)
    private contactRepository: Repository<Contact>,
    private readonly usersService: UsersService,
  ) {}

  // obtiene todos los contactos
  async getAllContacts(): Promise<Contact[]> {
    return this.contactRepository.find();
  }

  // crea un nuevo contacto
  async createContact(dto: CreateContactDto): Promise<{ message: string; contact_id: string }> {
    const user_register = await this.usersService.findByEmail(dto.email);

    if (user_register) {
      dto.user_id = user_register.id;
    }

    const contact = this.contactRepository.create(dto);
    const saved = await this.contactRepository.save(contact);

    return {
      message: 'Mensaje enviado correctamente',
      contact_id: saved.id,
    };
  }

  // obtiene un contacto por ID
  async getContactById(id: string): Promise<Contact> {
    const contact = await this.contactRepository.findOne({ where: { id } });
    if (!contact) {
      throw new NotFoundException(`Contacto con ID ${id} no encontrado`);
    }
    return contact;
  }

  // obtiene un contacto por email
  async getContactByEmail(email: string): Promise<Contact> {
    const contact = await this.contactRepository.findOne({ where: { email } });
    if (!contact) throw new NotFoundException('Contact not found');
    return contact;
  }

  // actualiza un contacto
  async updateContact(id: string, dto: UpdateContactDto): Promise<Contact> {
    const contact = await this.contactRepository.preload({
      id,
      ...dto,
    });

    if (!contact) throw new NotFoundException('Contact not found');

    return this.contactRepository.save(contact);
  }

  // elimina un contacto
  async deleteContact(id: string): Promise<{ message: string }> {
    const result = await this.contactRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Contacto con ID ${id} no encontrado`);
    }

    return { message: 'Contacto eliminado correctamente' };
  }
}
