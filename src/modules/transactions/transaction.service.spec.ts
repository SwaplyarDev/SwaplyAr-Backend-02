import { Test, TestingModule } from '@nestjs/testing';
import { TransactionsService } from './transactions.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Transaction } from './entities/transaction.entity';
import { FinancialAccountsService } from '@financial-accounts/financial-accounts.service';
import { AmountsService } from './amounts/amounts.service';
import { ProofOfPaymentsService } from '@financial-accounts/proof-of-payments/proof-of-payments.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { FileUploadDTO } from '../file-upload/dto/file-upload.dto';
import { Platform } from 'src/enum/platform.enum';

describe('TransactionsService', () => {
  let service: TransactionsService;

  // Mocks para simular el comportamiento de repositorio y servicios externos
  const mockTransactionRepo = {
    create: jest.fn(), // simula la creación de entidad en TypeORM
    save: jest.fn(), // simula guardar la entidad en DB
  };

  const mockFinancialAccountsService = {
    create: jest.fn(), // simula creación de cuentas financieras
  };

  const mockAmountsService = {
    create: jest.fn(), // simula creación del monto
  };

  const mockProofOfPaymentsService = {
    create: jest.fn(), // simula creación del comprobante de pago
  };

  // Antes de cada test creamos un módulo de prueba con los providers mockeados
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionsService,
        {
          provide: getRepositoryToken(Transaction), // inyecta repo mockeado
          useValue: mockTransactionRepo,
        },
        {
          provide: FinancialAccountsService,
          useValue: mockFinancialAccountsService,
        },
        { provide: AmountsService, useValue: mockAmountsService },
        {
          provide: ProofOfPaymentsService,
          useValue: mockProofOfPaymentsService,
        },
      ],
    }).compile();

    // Obtenemos la instancia real de TransactionsService con mocks inyectados
    service = module.get<TransactionsService>(TransactionsService);
  });

  it('debería crear una transacción correctamente', async () => {
    // DTO válido para crear la transacción
    const dto: CreateTransactionDto = {
      paymentsId: 'test-id',
      countryTransaction: 'Argentina',
      message: 'Transferencia de prueba',
      createdBy: 'devdylancrowder@outlook.com',
      financialAccounts: {
        senderAccount: {
          firstName: 'dylan',
          lastName: 'rojo',
          paymentMethod: {
            platformId: Platform.Bank,
            method: 'bank',
            bank: {
              currency: 'ARS',
              bankName: 'Banco Nación',
              sendMethodKey: 'CBU',
              sendMethodValue: '0001234500006789012345',
              documentType: 'DNI',
              documentValue: '12345678',
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
            platformId: Platform.Bank,
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

    // Simulamos archivo adjunto
    const fileData: FileUploadDTO = {
      buffer: Buffer.from('fake-proof'),
      fieldName: 'file',
      mimeType: 'image/jpeg',
      originalName: 'proof.jpg',
      size: 12345,
    };

    // Datos que retornarán los servicios mockeados
    const mockSender = { id: 'sender-id' };
    const mockReceiver = { id: 'receiver-id' };
    const mockAmount = { id: 'amount-id' };
    const mockProof = { id: 'proof-id' };
    const mockTransaction = { id: 'txn-id' };

    // Configuramos los mocks para que devuelvan los datos simulados
    mockFinancialAccountsService.create.mockResolvedValue({
      sender: mockSender,
      receiver: mockReceiver,
    });
    mockAmountsService.create.mockResolvedValue(mockAmount);
    mockProofOfPaymentsService.create.mockResolvedValue(mockProof);
    mockTransactionRepo.create.mockReturnValue(mockTransaction);
    mockTransactionRepo.save.mockResolvedValue(mockTransaction);

    // Ejecutamos la función a testear
    const result = await service.create(dto, fileData);

    // Validamos que el resultado sea el esperado (mockTransaction)
    expect(result).toEqual(mockTransaction);

    // Validamos que los servicios auxiliares fueron llamados con los datos correctos
    expect(mockFinancialAccountsService.create).toHaveBeenCalledWith(
      dto.financialAccounts,
    );
    expect(mockAmountsService.create).toHaveBeenCalledWith(dto.amount);
    expect(mockProofOfPaymentsService.create).toHaveBeenCalledWith(fileData);

    // Validamos que se haya creado la entidad Transaction con los datos correctos,
    // incluyendo los resultados de los servicios auxiliares y la fecha de creación
    expect(mockTransactionRepo.create).toHaveBeenCalledWith({
      ...dto,
      senderAccount: mockSender,
      receiverAccount: mockReceiver,
      createdAt: expect.any(Date), // la fecha puede ser cualquier instancia Date
      amount: mockAmount,
      proofOfPayment: mockProof,
    });

    // Validamos que el repositorio haya guardado la entidad creada
    expect(mockTransactionRepo.save).toHaveBeenCalledWith(mockTransaction);
  });
});
