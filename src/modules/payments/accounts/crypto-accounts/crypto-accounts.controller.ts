import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { CryptoAccountsService } from './crypto-accounts.service';
import { CreateCryptoAccountDto } from './dto/create-crypto-accounts.dto';
import { UpdateCryptoAccountDto } from './dto/update-crypto-accounts.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, } from '@nestjs/swagger';
import { CryptoAccountResponseDto } from './dto/crypto-accounts-response.dto';
import { JwtAuthGuard } from '@common/jwt-auth.guard';
import { RolesGuard } from '@common/guards/roles.guard';
import { Roles } from '@common/decorators/roles.decorator';

@ApiTags('Crypto Accounts')
@Controller('crypto-accounts')
export class CryptoAccountsController {
  constructor(private readonly cryptoAccountsService: CryptoAccountsService) { }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('user', 'admin')
  @Post()
  @ApiOperation({ summary: 'Create a new crypto account (user, admin)' })
  @ApiResponse({
    status: 201,
    description: 'The crypto account has been successfully created.',
    type: CryptoAccountResponseDto,
  })
  create(@Body() createCryptoAccountDto: CreateCryptoAccountDto, @Request() req) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-argument
    return this.cryptoAccountsService.create(createCryptoAccountDto, req.user.userId);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('user')
  @Get('my-accounts')
  @ApiOperation({ summary: 'Get my crypto accounts (user)' })
  @ApiResponse({
    status: 200,
    description: 'Return user virtual bank accounts.',
    type: [CryptoAccountResponseDto],
  })
  findMyAccounts(@Request() req) {
    return this.cryptoAccountsService.findByUserId(req.user.userId);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get()
  @ApiOperation({ summary: 'Get all crypto accounts (admin)' })
  @ApiResponse({
    status: 200,
    description: 'Return all crypto accounts.',
    type: [CryptoAccountResponseDto],
  })
  findAll() {
    return this.cryptoAccountsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a crypto account by id' })
  @ApiResponse({
    status: 200,
    description: 'Return the crypto account.',
    type: CryptoAccountResponseDto,
  })
  findOne(@Param('id') id: string) {
    return this.cryptoAccountsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a crypto account' })
  @ApiResponse({
    status: 200,
    description: 'The crypto account has been successfully updated.',
    type: CryptoAccountResponseDto,
  })
  update(@Param('id') id: string, @Body() updateCryptoAccountDto: UpdateCryptoAccountDto) {
    return this.cryptoAccountsService.update(id, updateCryptoAccountDto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('user','admin')
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a crypto account (admin)' })
  @ApiResponse({ status: 200, description: 'The crypto account has been successfully deleted.' })
  remove(@Param('id') id: string) {
    return this.cryptoAccountsService.remove(id);
  }
}
