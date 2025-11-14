import { Body, Controller, Get, Post } from '@nestjs/common';
import { PaymentMethodService } from './payment-method.service';
import {
  BankPaymentMethodDataResponseDto,
  CreatePaymentMethodDto,
  CreatePaymentMethodResponseDto,
  PixPaymentMethodDataResponseDto,
} from './dto/create-payment-method.dto';
import { ApiTags, ApiOperation, ApiBody, ApiOkResponse, ApiCreatedResponse } from '@nestjs/swagger';
import { PaymentMethodsResponseDto } from './dto/get-payment-methods-response.dto';

@ApiTags('Métodos de Pago')
@Controller('payment-method')
export class PaymentMethodController {
  constructor(private readonly paymentMethodService: PaymentMethodService) {}

  @ApiOperation({ summary: 'Crear un método de pago' })
  @ApiCreatedResponse({
    description: 'Método de pago creado correctamente',
    type: CreatePaymentMethodResponseDto,
  })
  @ApiBody({
    description: 'Datos para crear un método de pago',
    type: CreatePaymentMethodDto,
    examples: {
      banco: {
        summary: 'Método de pago tipo banco',
        value: {
          platformId: 'bank',
          method: 'bank',
          bank: {
            currency: 'ARS',
            bankName: 'Banco Nación',
            sendMethodKey: 'CBU',
            sendMethodValue: '1234567890123456789012',
            documentType: 'DNI',
            documentValue: '87654321',
          },
        },
      },
      pix: {
        summary: 'Método de pago tipo pix',
        value: {
          platformId: 'pix',
          method: 'pix',
          pix: {
            virtualBankId: 'uuid-virtual-bank',
            pixKey: 'clavePix',
            pixValue: 'valorPix',
            cpf: '12345678900',
          },
        },
      },
      crypto: {
        summary: 'Método de pago tipo receiver-crypto',
        value: {
          platformId: 'crypto',
          method: 'receiver-crypto',
          receiverCrypto: {
            currency: 'USDT',
            network: 'TRON',
            wallet: 'T9z...',
          },
        },
      },
      virtualBank: {
        summary: 'Método de pago tipo banco virtual',
        value: {
          platformId: 'virtual-bank',
          method: 'virtual-bank',
          virtualBank: {
            currency: 'BRL',
            emailAccount: 'usuario@banco.com',
            transferCode: 'codigo123',
          },
        },
      },
    },
  })
  @Post()
  async create(@Body() createPaymentMethodDto: CreatePaymentMethodDto) {
    return await this.paymentMethodService.create(createPaymentMethodDto);
  }

  @ApiOperation({ summary: 'Obtener todos los métodos de pago' })
  @ApiOkResponse({
    description: 'Lista de métodos de pago',
    type: [PaymentMethodsResponseDto],
  })
  @Get()
  async findAll() {
    return await this.paymentMethodService.findAllFinancialAccounts();
  }

  @ApiOperation({ summary: 'Obtener todos los métodos de pago tipo banco' })
  @ApiOkResponse({
    description: 'Lista de bancos',
    type: [BankPaymentMethodDataResponseDto],
  })
  @Get('/bank')
  async findAllBank() {
    return await this.paymentMethodService.findAllBank();
  }

  @ApiOperation({ summary: 'Obtener todos los métodos de pago tipo pix' })
  @ApiOkResponse({
    description: 'Lista de pix',
    type: [PixPaymentMethodDataResponseDto],
  })
  @Get('/pix')
  async findAllPix() {
    return await this.paymentMethodService.findAllPix();
  }
}
