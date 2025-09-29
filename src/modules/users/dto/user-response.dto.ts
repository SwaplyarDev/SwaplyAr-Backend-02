import { ApiProperty } from "@nestjs/swagger";

export class UserLocationDto {
  @ApiProperty({ example: '1a5bcb6c-2f9a-4677-b51e-9ee2fc295a5d' })
  id: string;

  @ApiProperty({ example: 'Colombia' })
  country: string;

  @ApiProperty({ example: 'Antioquia' })
  department: string;

  @ApiProperty({ example: '050021' })
  postalCode: string;

  @ApiProperty({
    type: 'string',           // fuerza a Swagger a tratarlo como string
    format: 'date-time',      // formato ISO
    example: '2025-09-24T00:00:00.000Z',
  })
  date: Date;
}

export class UserResponseDto {
  @ApiProperty({ example: 'd8e5fcb1-cf4b-4de9-823a-b075dfadaca2' })
  id: string;

   @ApiProperty({
  type: [UserLocationDto],
  example: [
    {
      id: '1a5bcb6c-2f9a-4677-b51e-9ee2fc295a5d',
      country: 'Colombia',
      department: 'Antioquia',
      postalCode: '050021',
      date: '2025-09-24T00:00:00.000Z',
    },
  ],
  })
  locations: UserLocationDto[];

  @ApiProperty({ example: 'user' })
  role: string;

  @ApiProperty({ example: true })
  termsAccepted: boolean;

  @ApiProperty({ example: '2025-09-25T14:42:02.386Z' })
  createdAt: Date;

  @ApiProperty({ nullable: true, example: null })
  validatedAt: Date | null;

  @ApiProperty({ example: true })
  isActive: boolean;

  @ApiProperty({ example: false })
  isValidated: boolean;

  @ApiProperty({ example: false })
  userValidated: boolean;
}

export class ProfileResponseDto {
  @ApiProperty({ example: '3305af05-9a75-46b7-8f82-1cdd10af47de' })
  id: string;

  @ApiProperty({ type: UserResponseDto })
  user: UserResponseDto;

  @ApiProperty({ example: 'Nahuel' })
  firstName: string;

  @ApiProperty({ example: 'Davila' })
  lastName: string;

  @ApiProperty({ example: 'JoseDev' })
  nickName: string;

  @ApiProperty({ example: 'coronajonhatan@gmail.com' })
  email: string;

  @ApiProperty({ nullable: true, example: null })
  identification: string | null;

  @ApiProperty({ nullable: true, example: null })
  phone: string | null;

  @ApiProperty({ nullable: true, example: '1990-01-01T00:00:00.000Z' })
  birthday: Date | null;

  @ApiProperty({ nullable: true, example: 35 })
  age: number | null;

  @ApiProperty({ nullable: true, example: 'M' })
  gender: string | null;

  @ApiProperty({ nullable: true, example: '2025-09-25T14:42:02.386Z' })
  lastActivity: Date | null;

  @ApiProperty({ nullable: true, example: 'https://example.com/profile.jpg' })
  profilePictureUrl: string | null;
}