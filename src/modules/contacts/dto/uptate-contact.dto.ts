import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateContactDto } from './create-contact.dto';

export class UpdateContactDto extends PartialType(CreateContactDto) {
  @ApiProperty({
    example: 'Nuevo mensaje actualizado',
    description: 'Ejemplo de actualización',
  })
  message?: string;
}
