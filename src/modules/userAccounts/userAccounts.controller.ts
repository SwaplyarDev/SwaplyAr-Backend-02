import { Controller, UseGuards } from '@nestjs/common';
import { AccountsService } from './userAccounts.service';
import { JwtAuthGuard } from 'src/common/jwt-auth.guard';
// eslint-disable-next-line prettier/prettier
import {
  ApiTags,
  ApiBearerAuth,

} from '@nestjs/swagger';


@ApiTags('Cuentas de Usuario')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users/accounts')
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}
}
