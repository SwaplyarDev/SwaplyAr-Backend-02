

import { IsString, IsOptional, IsUUID, Length, Matches } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ExclusiveCodeOrCodeId } from '../../common/validators/exclusive-code-or-codeId.validator';

@ExclusiveCodeOrCodeId ({ message: 'Debe proporcionar codeId o code, pero no ambos' })

export class CreateUserDiscountDto {

  @ApiProperty ({

    description: 'ID del usuario que recibirá el descuento',
    example: 'f93cf445-91a6-4133-955e-450412e25170',

  })

  @IsUUID ('4', { message: 'userId debe ser un UUID válido' })
  userId: string;

  @ApiPropertyOptional ({

    description: 'ID del código de descuento global (UUID)',
    example: 'e5dad814-ba15-40e4-be23-fbf26e7f6ce9',

  })

  @IsOptional ()
  @IsUUID ('4', { message: 'codeId debe ser un UUID válido' })
  codeId?: string;

  @ApiPropertyOptional ({

    description: 'Código de descuento (se usa si no se pasa codeId)',
    example: 'WELCOME-7083WC',

  })

  @IsOptional ()
  @IsString ({ message: 'El código debe ser un string' })
  @Length (5, 20, { message: 'El código debe tener entre 5 y 20 caracteres' })

  @Matches (/^[A-Z0-9_-]+$/, {

    message: 'El código solo puede contener mayúsculas, números, guiones y guiones bajos',

  })
  code?: string;

  @ApiPropertyOptional ({

    description: 'ID de la transacción asociada (exactamente 10 caracteres alfanuméricos)',
    example: 'vzGua5nfRo',

  })

  @IsOptional ()
  @IsString ({ message: 'transactionId debe ser un string' })
  @Length (10, 10, { message: 'El transactionId debe tener exactamente 10 caracteres' })

  @Matches (/^[a-zA-Z0-9]+$/, {

    message: 'El transactionId solo puede contener letras y números',

  })
  transactionId?: string;
  
}





