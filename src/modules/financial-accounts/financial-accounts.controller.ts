import { Body, Controller, Get, Post } from '@nestjs/common';
import { FinancialAccountsService } from './financial-accounts.service';
import { CreateFinancialAccountDto } from './dto/create-financial-accounts.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

@ApiTags('Financial Accounts')
@Controller('financial-accounts')
export class FinancialAccountController {
  constructor(
    private readonly financialAccountsService: FinancialAccountsService,
  ) {}

  @ApiOperation({ summary: 'Crear cuentas financieras (emisor y receptor)' })
  @ApiResponse({ status: 201, description: 'Cuentas creadas correctamente', schema: {
    example: {
      sender: {
        id: 'uuid-sender',
        firstName: 'Juan',
        lastName: 'Pérez',
        paymentMethod: { /* ... */ }
      },
      receiver: {
        id: 'uuid-receiver',
        firstName: 'Ana',
        lastName: 'García',
        paymentMethod: { /* ... */ }
      }
    }
  }})
  @ApiBody({
    description: 'Datos para crear cuentas financieras',
    type: CreateFinancialAccountDto,
    examples: {
      ejemplo1: {
        summary: 'Ejemplo de request',
        value: {
          senderAccount: {
            firstName: 'Juan',
            lastName: 'Pérez',
            paymentMethod: {
              platformId: 'bank',
              method: 'bank',
              bank: {
                currency: 'ARS',
                bankName: 'Banco Nación',
                sendMethodKey: 'CBU',
                sendMethodValue: '1234567890123456789012',
                documentType: 'DNI',
                documentValue: '87654321'
              }
            }
          },
          receiverAccount: {
            firstName: 'Ana',
            lastName: 'García',
            document_value: '12345678',
            phoneNumber: '1122334455',
            email: 'ana@example.com',
            bank_name: 'Banco Galicia',
            paymentMethod: {
              platformId: 'bank',
              method: 'bank',
              bank: {
                currency: 'ARS',
                bankName: 'Banco Galicia',
                sendMethodKey: 'CBU',
                sendMethodValue: '1234567890123456789012',
                documentType: 'DNI',
                documentValue: '12345678'
              }
            }
          }
        }
      }
    }
  })
  @Post()
  async create(@Body() createFinancialAccountDto: CreateFinancialAccountDto) {
    return this.financialAccountsService.create(createFinancialAccountDto);
  }

  @ApiOperation({ summary: 'Obtener todas las cuentas financieras emisoras' })
  @ApiResponse({ status: 200, description: 'Lista de cuentas emisoras', schema: {
    example: [
      {
        id: 'uuid-sender',
        firstName: 'Juan',
        lastName: 'Pérez',
        paymentMethod: { /* ... */ }
      }
    ]
  }})
  @Get('/sender')
  async findAllSender() {
    return await this.financialAccountsService.findAllSender();
  }

  @ApiOperation({ summary: 'Obtener todas las cuentas financieras receptoras' })
  @ApiResponse({ status: 200, description: 'Lista de cuentas receptoras', schema: {
    example: [
      {
        id: 'uuid-receiver',
        firstName: 'Ana',
        lastName: 'García',
        paymentMethod: { /* ... */ }
      }
    ]
  }})
  @Get('/receiver')
  async findAllReceiver() {
    return await this.financialAccountsService.findAllReceiver();
  }
}
