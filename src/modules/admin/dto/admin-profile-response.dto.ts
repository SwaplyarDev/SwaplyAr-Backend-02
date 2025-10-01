import { ApiProperty } from '@nestjs/swagger';

export class AdminProfileResponseDto {
  @ApiProperty({
    description: 'Fecha de registro del usuario',
    example: '2025-09-25T14:42:52.378Z',
  })
  fechaRegistro: string;

  @ApiProperty({
    description: 'ID del usuario',
    example: 'f3282e57-aaa6-4263-9b17-7db1992d4d76',
  })
  userId: string;

  @ApiProperty({
    description: 'ID del perfil',
    example: 'e997eb7b-dc81-4a3b-91f4-784bd76da2d2',
  })
  profileId: string;

  @ApiProperty({
    description: 'Nombre completo del usuario',
    example: 'Juan Pérez',
  })
  nombre: string;

  @ApiProperty({
    description: 'Correo electrónico del usuario',
    example: 'example@gmail.com',
  })
  email: string;

  @ApiProperty({
    description: 'Teléfono del usuario',
    example: '+573001112233',
  })
  telefono: string;

  @ApiProperty({
    description: 'País del usuario',
    example: 'Colombia',
  })
  pais: string;
}
