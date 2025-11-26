import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { CryptoNetworksService } from './crypto-networks.service';
import { CreateCryptoNetworkDto } from './dto/create-crypto-networks.dto';
import { UpdateCryptoNetworkDto } from './dto/update-crypto-networks.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../common/jwt-auth.guard';
import { CryptoNetworkResponseDto } from './dto/crypto-networks-response.dto';
import { Roles } from '../../../common/decorators/roles.decorator';
import { UserRole } from '../../../enum/user-role.enum';
import { RolesGuard } from '../../../common/guards/roles.guard';

@ApiTags('Crypto Networks')
@Controller('crypto-networks')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CryptoNetworksController {
  constructor(private readonly cryptoNetworksService: CryptoNetworksService) {}

  @Post()
  @Roles(UserRole.Admin)
  @ApiOperation({ summary: 'Create a new crypto network' })
  @ApiResponse({
    status: 201,
    description: 'The crypto network has been successfully created.',
    type: CryptoNetworkResponseDto,
  })
  create(@Body() createCryptoNetworkDto: CreateCryptoNetworkDto) {
    return this.cryptoNetworksService.create(createCryptoNetworkDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all crypto networks' })
  @ApiResponse({
    status: 200,
    description: 'Return all crypto networks.',
    type: [CryptoNetworkResponseDto],
  })
  findAll() {
    return this.cryptoNetworksService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a crypto network by id' })
  @ApiResponse({
    status: 200,
    description: 'Return the crypto network.',
    type: CryptoNetworkResponseDto,
  })
  findOne(@Param('id') id: string) {
    return this.cryptoNetworksService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.Admin)
  @ApiOperation({ summary: 'Update a crypto network' })
  @ApiResponse({
    status: 200,
    description: 'The crypto network has been successfully updated.',
    type: CryptoNetworkResponseDto,
  })
  update(@Param('id') id: string, @Body() updateCryptoNetworkDto: UpdateCryptoNetworkDto) {
    return this.cryptoNetworksService.update(id, updateCryptoNetworkDto);
  }

  @Delete(':id')
  @Roles(UserRole.Admin)
  @ApiOperation({ summary: 'Delete a crypto network' })
  @ApiResponse({ status: 200, description: 'The crypto network has been successfully deleted.' })
  remove(@Param('id') id: string) {
    return this.cryptoNetworksService.remove(id);
  }
}
