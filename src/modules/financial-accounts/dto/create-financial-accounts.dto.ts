import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsUUID } from 'class-validator';

export class CreateFinancialAccountDto {
  @ApiProperty({
    example: 'c1ab37c0-b376-4dc2-b772-0023ef4bb3df',
    description: 'ID de la plataforma de pago (FK a payment_platforms)',
  })
  @IsUUID()
  paymentPlatformId: string;

  @ApiProperty({
    example: '7f3ff720-a30f-4d59-a1ae-f05fa39f74d3',
    description: 'ID de la cuenta real (bank_account_id, pix_account_id, etc.)',
  })
  @IsUUID()
  referenceId: string;

  @ApiProperty({
    example: 'e98d5deb-02f5-4466-8aaa-0ae638836422',
    nullable: true,
    description: 'Usuario dueño. Puede ser null si es global/admin.',
  })
  @IsUUID()
  @IsOptional()
  userId?: string;

  @ApiProperty({
    example: 'user',
    description: 'Tipo de dueño',
    default: 'user',
  })
  ownerType: string;
}
