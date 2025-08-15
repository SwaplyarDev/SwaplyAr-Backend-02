import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Platform } from 'src/enum/platform.enum';

export class UserAccValuesDto {
  @IsUUID()
  userId: string;

  @IsString()
  accountName: string;

  @IsEnum(Platform)
  accountType: Platform;

  @IsOptional()
  @IsBoolean()
  status?: boolean;
}

export class CreateBankAccountDto {
  @ValidateNested()
  @Type(() => UserAccValuesDto)
  userAccValues: UserAccValuesDto;
}
