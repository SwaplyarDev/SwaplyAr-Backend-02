import { ApiProperty } from '@nestjs/swagger';

export class StarsDataDto {
  @ApiProperty({
    description: 'Cantidad de recompensas',
    example: 500,
  })
  quantity: number;

  @ApiProperty({
    description: 'Cantidad de estrellas',
    example: 2,
  })
  stars: number;
}

export class StarsFromUserDto {
  @ApiProperty({ type: () => StarsDataDto })
  data: StarsDataDto;
}
