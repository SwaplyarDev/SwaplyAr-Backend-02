import { Body, Controller, Get, Post } from '@nestjs/common';
import { PaymentMethodService } from './payment-method.service';
import { CreatePaymentMethodDto } from './dto/create-payment-method.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

@ApiTags('Métodos de Pago')
@Controller('payment-method')
export class PaymentMethodController {
  constructor(private readonly paymentMethodService: PaymentMethodService) {}

  @ApiOperation({ summary: 'Crear un método de pago' })
  @ApiResponse({
    status: 201,
    description: 'Método de pago creado correctamente',
    schema: {
      example: {
        id: 'uuid',
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
  @ApiResponse({
    status: 200,
    description: 'Lista de métodos de pago',
    schema: {
      example: [
        {
          id: 'uuid',
          platformId: 'bank',
          method: 'bank',
          bank: {
            /* ... */
          },
        },
      ],
    },
  })
  @Get()
  async findAll() {
    return await this.paymentMethodService.findAllFinancialAccounts();
  }

  @ApiOperation({ summary: 'Obtener todos los métodos de pago tipo banco' })
  @ApiResponse({
    status: 200,
    description: 'Lista de bancos',
    schema: {
      example: [
        {
          id: 'uuid',
          currency: 'ARS',
          bankName: 'Banco Nación',
          sendMethodKey: 'CBU',
          sendMethodValue: '1234567890123456789012',
          documentType: 'DNI',
          documentValue: '87654321',
        },
      ],
    },
  })
  @Get('/bank')
  async findAllBank() {
    return await this.paymentMethodService.findAllBank();
  }

  @ApiOperation({ summary: 'Obtener todos los métodos de pago tipo pix' })
  @ApiResponse({
    status: 200,
    description: 'Lista de pix',
    schema: {
      example: [
        {
          id: 'uuid',
          virtualBankId: 'uuid-virtual-bank',
          pixKey: 'clavePix',
          pixValue: 'valorPix',
          cpf: '12345678900',
        },
      ],
    },
  })
  @Get('/pix')
  async findAllPix() {
    return await this.paymentMethodService.findAllPix();
  }
}
