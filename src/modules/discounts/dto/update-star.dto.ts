

import { IsInt, Min, IsString, Length, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class UpdateStarDto {

  @ApiProperty ({

    description: 'Monto de la transacción a añadir a las recompensas',
    example: 100,

  })

  @Type (() => Number)
  @IsInt ({ message: 'quantity debe ser un número entero' })
  @Min (1, { message: 'quantity debe ser al menos 1' })
  quantity: number;

  @ApiProperty ({

    description: 'Id de la transacción asociada (exactamente 10 caracteres alfanuméricos)',
    example: 'vzGua5nfRo',

  })

  @IsString ({ message: 'transactionId debe ser un string' })
  @Length (10, 10, { message: 'transactionId debe tener exactamente 10 caracteres' })

  @Matches(/^[a-zA-Z0-9]+$/, {

    message: 'transactionId solo puede contener letras y números',

  })
  transactionId: string;
  
}

