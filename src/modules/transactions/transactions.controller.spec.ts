import { Test, TestingModule } from '@nestjs/testing';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { FileUploadDTO } from '../file-upload/dto/file-upload.dto';
import { plainToInstance } from 'class-transformer';
import { Readable } from 'stream';

describe('TransactionsController', () => {
  let controller: TransactionsController;

  // Mock del servicio con métodos espía
  const mockTransactionsService = {
    create: jest.fn(),
    findAll: jest.fn(),
    getTransactionByEmail: jest.fn(),
  };

  beforeEach(async () => {
    // Creamos el módulo de testing con el controlador y el mock del servicio
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
    expect(controller).toBeDefined(); // Verifica que el controlador se haya instanciado correctamente
  });

  describe('create', () => {
    it('should call service.create and return full detailed transaction response', async () => {
      const dto = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        countryTransaction: 'Argentina',
        message: 'Transferencia de prueba',
        createdBy: 'devdylancrowder@outlook.com',
        financialAccounts: {
          senderAccount: {
            firstName: 'dylan',
            lastName: 'rojo',
            paymentMethod: {
              platformId: 'bank',
              method: 'bank',
              bank: {
                accountNumber: '1234567890',
                cbu: '0001234500006789012345',
                bankName: 'Banco Nación',
              },
            },
          },
          receiverAccount: {
            firstName: 'Juan',
            lastName: 'Perez',
            document_value: '87654321',
            phoneNumber: '0987654321',
            email: 'transporterojo.cba@gmail.com',
            paymentMethod: {
              platformId: 'bank',
              method: 'bank',
              bank: {
                accountNumber: '9876543210',
                cbu: '0009876500001234567890',
                bankName: 'Banco Galicia',
              },
            },
            bank_name: 'Banco Galicia',
          },
        },
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

      const body = {
        createTransactionDto: JSON.stringify(dto),
      };

      const file: Express.Multer.File = {
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
      };

      const expectedDto = plainToInstance(CreateTransactionDto, dto);

      const expectedFileData: FileUploadDTO = {
        buffer: file.buffer,
        fieldName: file.fieldname,
        mimeType: file.mimetype,
        originalName: file.originalname,
        size: file.size,
      };

      // Esta es la respuesta que tu servicio devolverá y que querés testear
      const mockResponse = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        countryTransaction: 'Argentina',
        message: 'Transferencia de prueba',
        createdAt: '2025-07-28T23:42:50.446Z',
        createdBy: 'devdylancrowder@outlook.com',
        finalStatus: 'pending',
        senderAccount: {
          id: 'c8f38d12-f843-4673-871e-210d4e6d8501',
          firstName: 'dylan',
          lastName: 'rojo',
          paymentMethod: {
            id: 'bda57996-6993-4b7a-807b-e8ed0aebf265',
            platformId: 'bank',
            method: 'bank',
            currency: null,
            bankName: 'Banco Nación',
            sendMethodKey: null,
            sendMethodValue: null,
            documentType: null,
            documentValue: null,
          },
          email: null,
        },
        receiverAccount: {
          id: '59cc18c5-7481-4745-b480-3778a2145ad7',
          firstName: 'Juan',
          lastName: 'Perez',
          paymentMethod: {
            id: 'c1cf1922-8856-4ff1-acfa-d251946c00d0',
            platformId: 'bank',
            method: 'bank',
            currency: null,
            bankName: 'Banco Galicia',
            sendMethodKey: null,
            sendMethodValue: null,
            documentType: null,
            documentValue: null,
          },
          identificationNumber: null,
          phoneNumber: '0987654321',
          email: 'transporterojo.cba@gmail.com',
        },
        userId: null,
        proofOfPayment: {
          id: '95a6add5-54a3-4dfa-a0ff-2661aaf1898c',
          imgUrl:
            'https://res.cloudinary.com/dy1jiclwg/image/upload/v1753746271/proof-of-payments/proofOfPayment_Flag_of_Argentina.png_1753746170500.png',
          createAt: '2025-07-28T23:42:51.748Z',
        },
        amount: {
          id: '4334e2bf-8a7d-484b-a40f-9ef33d40d773',
          amountSent: 10000,
          currencySent: 'ARS',
          amountReceived: 10000,
          currencyReceived: 'ARS',
          received: false,
        },
      };

      mockTransactionsService.create.mockResolvedValue(mockResponse);

      const result = await controller.create(body, file);

      expect(mockTransactionsService.create).toHaveBeenCalledWith(
        expectedDto,
        expectedFileData,
      );

      expect(result).toEqual(mockResponse);
    });
  });
});
