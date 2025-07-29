import { Test, TestingModule } from '@nestjs/testing';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { FileUploadDTO } from '../file-upload/dto/file-upload.dto';
import { plainToInstance } from 'class-transformer';
import { Readable } from 'stream';

describe('TransactionsController', () => {
  let controller: TransactionsController;

  // Mock del servicio con jest.fn()
  const mockTransactionsService = {
    create: jest.fn(),
    findAll: jest.fn(),
    getTransactionByEmail: jest.fn(),
  };

  beforeEach(async () => {
    // Configuramos el módulo de testing con controlador y mock del servicio
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactionsController],
      providers: [
        {
          provide: TransactionsService,
          useValue: mockTransactionsService,
        },
      ],
    }).compile();

    controller = module.get<TransactionsController>(TransactionsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined(); // Controlador debe instanciarse correctamente
  });

  // Helper para simular archivo subido
  const createMockFile = (): Express.Multer.File => ({
    buffer: Buffer.from('test-buffer'),
    fieldname: 'file',
    mimetype: 'image/png',
    originalname: 'comprobante.png',
    size: 1234,
    stream: Readable.from(['test']),
    destination: '',
    encoding: '',
    filename: '',
    path: '',
  });

  // Campos comunes para todos los DTOs
  const commonDtoFields = {
    id: '550e8400-e29b-41d4-a716-446655440000',
    countryTransaction: 'Argentina',
    message: 'Transferencia de prueba',
    createdBy: 'devdylancrowder@outlook.com',
    amount: {
      amountSent: 10000,
      currencySent: 'ARS',
      amountReceived: 10000,
      currencyReceived: 'ARS',
    },
    proofOfPayment: {
      type: 'image',
      url: 'https://example.com/proof.jpg',
    },
    createdAt: '2024-01-01T00:00:00Z',
    finalStatus: 'pending',
  };

  // Construye el DTO según el método de pago del sender
  function buildDto(senderPaymentMethod: any) {
    return {
      ...commonDtoFields,
      financialAccounts: {
        senderAccount: {
          firstName: 'dylan',
          lastName: 'rojo',
          paymentMethod: senderPaymentMethod,
        },
        receiverAccount: {
          firstName: 'Juan',
          lastName: 'Perez',
          phoneNumber: '0987654321',
          email: 'transporterojo.cba@gmail.com',
          paymentMethod: {
            platformId: 'bank',
            method: 'bank',
            bank: {
              currency: 'ARS',
              bankName: 'Banco Galicia',
              sendMethodKey: 'CBU',
              sendMethodValue: '0009876500001234567890',
              documentType: 'DNI',
              documentValue: '87654321',
            },
          },
        },
      },
    };
  }

  // Casos de prueba para distintos métodos de pago
  const testCases = [
    {
      name: 'bank',
      senderPaymentMethod: {
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
    {
      name: 'pix',
      senderPaymentMethod: {
        platformId: 'pix',
        method: 'pix',
        pix: {
          virtualBankId: '123',
          pixKey: 'email',
          pixValue: 'usuario@example.com',
          cpf: '12345678901',
        },
      },
    },
    {
      name: 'receiver-crypto',
      senderPaymentMethod: {
        platformId: 'receiver_crypto',
        method: 'receiver-crypto',
        receiverCrypto: {
          currency: 'USDT',
          network: 'TRC20',
          wallet: 'TYM7V7zYNEsZt6uKcv6iXGpFbEkqUgB2SK',
        },
      },
    },
    {
      name: 'virtual-bank',
      senderPaymentMethod: {
        platformId: 'virtual_bank',
        method: 'virtual-bank',
        virtualBank: {
          currency: 'ARS',
          emailAccount: 'nahuel@gmail.com',
          transferCode: '123',
        },
      },
    },
  ];

  // Test parametrizado para todos los métodos de pago
  it.each(testCases)(
    'should create transaction with method $name',
    async ({ senderPaymentMethod, name }) => {
      const dto = buildDto(senderPaymentMethod);

      // Mock de respuesta similar al DTO pero con ids y estructura esperada
      const mockResponse = {
        ...dto,
        senderAccount: {
          id: `sender-id-${name}`,
          firstName: dto.financialAccounts.senderAccount.firstName,
          lastName: dto.financialAccounts.senderAccount.lastName,
          paymentMethod: {
            id: `paymentmethod-id-${name}`,
            ...senderPaymentMethod,
          },
          email: null,
        },
        receiverAccount: {
          id: `receiver-id-${name}`,
          firstName: dto.financialAccounts.receiverAccount.firstName,
          lastName: dto.financialAccounts.receiverAccount.lastName,
          paymentMethod: {
            id: 'paymentmethod-id-bank',
            platformId: 'bank',
            method: 'bank',
            currency: 'ARS',
            bankName: 'Banco Galicia',
            sendMethodKey: 'CBU',
            sendMethodValue: '0009876500001234567890',
            documentType: 'DNI',
            documentValue: '87654321',
          },
          identificationNumber: null,
          phoneNumber: dto.financialAccounts.receiverAccount.phoneNumber,
          email: dto.financialAccounts.receiverAccount.email,
        },
        userId: null,
      };

      // Simula body y archivo recibidos por el controller
      const body = { createTransactionDto: JSON.stringify(dto) };
      const file = createMockFile();

      // Convierte plain object a instancia de DTO
      const expectedDto = plainToInstance(CreateTransactionDto, dto);

      // Prepara datos del archivo esperados por el servicio
      const expectedFileData: FileUploadDTO = {
        buffer: file.buffer,
        fieldName: file.fieldname,
        mimeType: file.mimetype,
        originalName: file.originalname,
        size: file.size,
      };

      // Mockea el método create para que devuelva mockResponse
      mockTransactionsService.create.mockResolvedValue(mockResponse);

      // Ejecuta la función del controller
      const result = await controller.create(body, file);

      // Verifica que el servicio haya sido llamado con los parámetros correctos
      expect(mockTransactionsService.create).toHaveBeenCalledWith(
        expectedDto,
        expectedFileData,
      );

      // Verifica que el resultado sea el esperado
      expect(result).toEqual(mockResponse);
    },
  );
});
