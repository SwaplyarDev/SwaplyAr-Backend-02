import { ApiProperty } from '@nestjs/swagger';

export class UpdateAdminProfileResponseDto {
  @ApiProperty({
    description: 'ID del perfil actualizado',
    example: 'e997eb7b-dc81-4a3b-91f4-784bd76da2d2',
  })
  profileId: string;

  @ApiProperty({
    description: 'ID del usuario asociado',
    example: 'f3282e57-aaa6-4263-9b17-7db1992d4d76',
  })
  userId: string;

  @ApiProperty({
    description: 'Nombre actualizado',
    example: 'Juan',
  })
  firstName: string;

  @ApiProperty({
    description: 'Apellido actualizado',
    example: 'Pérez',
  })
  lastName: string;

  @ApiProperty({
    description: 'Apodo o nickname',
    example: 'JPDev',
  })
  nickName: string;

  @ApiProperty({
    description: 'Correo electrónico actualizado',
    example: 'example@gmail.com',
  })
  email: string;

  @ApiProperty({
    description: 'Teléfono actualizado',
    example: '+573001112233',
  })
  phone: string;
}
