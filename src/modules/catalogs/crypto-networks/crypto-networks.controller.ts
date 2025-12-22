import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { CryptoNetworksService } from './crypto-networks.service';
import { CreateCryptoNetworkDto } from './dto/create-crypto-networks.dto';
import { UpdateCryptoNetworkDto } from './dto/update-crypto-networks.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { CryptoNetworkResponseDto } from './dto/crypto-networks-response.dto';
import { JwtAuthGuard } from '../../../common/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';

@ApiTags('Crypto Networks')
@Controller('crypto-networks')
export class CryptoNetworksController {
  constructor(private readonly cryptoNetworksService: CryptoNetworksService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'user')
  @Get()
  @ApiOperation({ summary: 'Obtener toda las crypto networks' })
  @ApiResponse({
    status: 200,
    description: 'Return all crypto networks.',
    type: [CryptoNetworkResponseDto],
  })
  findAll() {
    return this.cryptoNetworksService.findAll();
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Post()
  @ApiOperation({ summary: 'Crear una nueva crypto network' })
  @ApiResponse({
    status: 201,
    description: 'The crypto network has been successfully created.',
    type: CryptoNetworkResponseDto,
  })
  create(@Body() createCryptoNetworkDto: CreateCryptoNetworkDto) {
    return this.cryptoNetworksService.create(createCryptoNetworkDto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'user')
  @Get(':id')
  @ApiOperation({ summary: 'Obtener crypto network por ID' })
  @ApiResponse({
    status: 200,
    description: 'Return the crypto network.',
    type: CryptoNetworkResponseDto,
  })
  findOne(@Param('id') id: string) {
    return this.cryptoNetworksService.findOne(id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar crypto network' })
  @ApiResponse({
    status: 200,
    description: 'The crypto network has been successfully updated.',
    type: CryptoNetworkResponseDto,
  })
  update(@Param('id') id: string, @Body() updateCryptoNetworkDto: UpdateCryptoNetworkDto) {
    return this.cryptoNetworksService.update(id, updateCryptoNetworkDto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar crypto network' })
  @ApiResponse({ status: 200, description: 'The crypto network has been successfully deleted.' })
  remove(@Param('id') id: string) {
    return this.cryptoNetworksService.remove(id);
  }
}
