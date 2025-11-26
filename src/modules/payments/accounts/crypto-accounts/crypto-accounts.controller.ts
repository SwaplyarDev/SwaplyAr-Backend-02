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
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../../common/jwt-auth.guard';
import { CryptoAccountResponseDto } from './dto/crypto-accounts-response.dto';

@ApiTags('Crypto Accounts')
@Controller('crypto-accounts')
@UseGuards(JwtAuthGuard)
export class CryptoAccountsController {
  constructor(private readonly cryptoAccountsService: CryptoAccountsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new crypto account' })
  @ApiResponse({
    status: 201,
    description: 'The crypto account has been successfully created.',
    type: CryptoAccountResponseDto,
  })
  create(@Body() createCryptoAccountDto: CreateCryptoAccountDto, @Request() req) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-argument
    return this.cryptoAccountsService.create(createCryptoAccountDto, req.user.userId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all crypto accounts' })
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

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a crypto account' })
  @ApiResponse({ status: 200, description: 'The crypto account has been successfully deleted.' })
  remove(@Param('id') id: string) {
    return this.cryptoAccountsService.remove(id);
  }
}
