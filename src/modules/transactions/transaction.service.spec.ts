import { Test, TestingModule } from '@nestjs/testing';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';
import { Transaction } from './entities/transaction.entity';

describe('TransactionsController', () => {
  let controller: TransactionsController;
  let service: TransactionsService;

  const dtoObject = {
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
  };

  const mockTransaction: Transaction = {
    ...dtoObject,
    id: '550e8400-e29b-41d4-a716-446655440000',
    proofOfPayment: {
      type: 'image',
      url: 'https://example.com/proof.jpg',
    },
    createdAt: '2024-01-01T00:00:00Z',
    finalStatus: 'pending',
  } as Transaction;

  const mockFile: Express.Multer.File = {
    fieldname: 'file',
    originalname: 'proof.jpg',
    encoding: '7bit',
    mimetype: 'image/jpeg',
    buffer: Buffer.from('data'),
    size: 123,
    destination: '',
    filename: '',
    path: '',
    stream: require('stream').Readable.from([]),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactionsController],
      providers: [
        {
          provide: TransactionsService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<TransactionsController>(TransactionsController);
    service = module.get<TransactionsService>(TransactionsService);
  });

  it('debería crear transacción con archivo', async () => {
    jest.spyOn(service, 'create').mockResolvedValue(mockTransaction);

    const body = {
      createTransactionDto: JSON.stringify(dtoObject),
    };

    const result = await controller.create(body, mockFile);

    expect(service.create).toHaveBeenCalledWith(
      expect.objectContaining(dtoObject),
      expect.any(Object),
    );

    expect(result).toEqual(mockTransaction);
  });
});
