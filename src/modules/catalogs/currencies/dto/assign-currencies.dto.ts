import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsUUID, ArrayNotEmpty } from 'class-validator';

export class AssignCountriesDto {
  @ApiProperty({
    type: [String],
    example: ['a8c4bd7a-6c3b-4a9d-9f38-9f547cc1c2a1', 'c3a20c1d-59a1-42f7-8fa4-0fa90be7e981'],
    description: 'IDs de países a asignar a la moneda',
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsUUID('4', { each: true })
  countryIds: string[];
}
