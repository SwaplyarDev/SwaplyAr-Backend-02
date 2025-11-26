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
import { VirtualBankAccountsService } from './virtual-bank-accounts.service';
import { CreateVirtualBankAccountDto } from './dto/create-virtual-bank-accounts.dto';
import { UpdateVirtualBankAccountDto } from './dto/update-virtual-bank-accounts.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../common/jwt-auth.guard';
import { VirtualBankAccountResponseDto } from './dto/virtual-bank-accounts-response.dto';

@ApiTags('Virtual Bank Accounts')
@Controller('virtual-bank-accounts')
@UseGuards(JwtAuthGuard)
export class VirtualBankAccountsController {
  constructor(private readonly virtualBankAccountsService: VirtualBankAccountsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new virtual bank account' })
  @ApiResponse({
    status: 201,
    description: 'The virtual bank account has been successfully created.',
    type: VirtualBankAccountResponseDto,
  })
  create(@Body() createVirtualBankAccountDto: CreateVirtualBankAccountDto, @Request() req) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-argument
    return this.virtualBankAccountsService.create(createVirtualBankAccountDto, req.user.userId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all virtual bank accounts' })
  @ApiResponse({
    status: 200,
    description: 'Return all virtual bank accounts.',
    type: [VirtualBankAccountResponseDto],
  })
  findAll() {
    return this.virtualBankAccountsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a virtual bank account by id' })
  @ApiResponse({
    status: 200,
    description: 'Return the virtual bank account.',
    type: VirtualBankAccountResponseDto,
  })
  findOne(@Param('id') id: string) {
    return this.virtualBankAccountsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a virtual bank account' })
  @ApiResponse({
    status: 200,
    description: 'The virtual bank account has been successfully updated.',
    type: VirtualBankAccountResponseDto,
  })
  update(
    @Param('id') id: string,
    @Body() updateVirtualBankAccountDto: UpdateVirtualBankAccountDto,
  ) {
    return this.virtualBankAccountsService.update(id, updateVirtualBankAccountDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a virtual bank account' })
  @ApiResponse({
    status: 200,
    description: 'The virtual bank account has been successfully deleted.',
  })
  remove(@Param('id') id: string) {
    return this.virtualBankAccountsService.remove(id);
  }
}
