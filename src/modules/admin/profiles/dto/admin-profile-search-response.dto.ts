import { ApiProperty } from "@nestjs/swagger";
import { ProfileResponseDto } from "@users/dto/user-response.dto";

export class AdminProfileSearchResponseDto {
  @ApiProperty({ example: 'Perfiles obtenidos correctamente' })
  message: string;

  @ApiProperty({ type: () => ProfileResponseDto })
  result: ProfileResponseDto;
}
