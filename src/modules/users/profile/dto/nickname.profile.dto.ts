import { IsString } from 'class-validator';

export class UpdateNicknameDto {
  @IsString()
  nickName: string;
}
