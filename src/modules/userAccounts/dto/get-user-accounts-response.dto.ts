import { ApiProperty } from '@nestjs/swagger';

export class UserAccountsFormDataDto {}

export class UserAccountsValuesDto {
  @ApiProperty({ example: 'Juan' })
  first_name: string;

  @ApiProperty({ example: 'Pérez' })
  last_name: string;

  @ApiProperty({ example: '123456789' })
  identification: string;

  @ApiProperty({ example: 'ARS' })
  currency: string;

  @ApiProperty({ example: 'Cuenta Principal' })
  account_name: string;

  @ApiProperty({ example: 1 })
  account_type: number;
}

export class UserAccountsResponseDto {
  @ApiProperty({ example: 'uuid' })
  id: string;

  @ApiProperty({ example: 'bank' })
  typeAccount: string;

  @ApiProperty({ type: UserAccountsFormDataDto })
  formData: UserAccountsFormDataDto;

  @ApiProperty({ type: UserAccountsValuesDto })
  userAccValues: UserAccountsValuesDto;
}
