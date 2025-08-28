// transactions.controller.int-spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { plainToInstance } from 'class-transformer';
import { Transaction } from './entities/transaction.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Readable } from 'stream';
import { AdministracionStatusLog } from '@admin/entities/administracion-status-log.entity';
import { FinancialAccountsService } from '@financial-accounts/financial-accounts.service';
import { AmountsService } from './amounts/amounts.service';
import { ProofOfPaymentsService } from '@financial-accounts/proof-of-payments/proof-of-payments.service';
import { MailerService } from '@mailer/mailer.service';
import { JwtService } from '@nestjs/jwt';

describe('TransactionsController (integración real)', () => {
  let controller: TransactionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactionsController],
      providers: [
        TransactionsService,
        {
          provide: getRepositoryToken(Transaction),
          useValue: {
            create: jest.fn().mockImplementation((dto) => ({
              ...dto,
              senderAccount: dto.financialAccounts?.senderAccount || {
                firstName: 'Pedro',
                lastName: 'Gomez',
                paymentMethod: { platformId: 'virtual_bank' },
              },
              receiverAccount: dto.financialAccounts?.receiverAccount || {
                firstName: 'Juan',
                lastName: 'Pérez',
                paymentMethod: { bankName: 'Banco Galicia' },
              },
            })),
            save: jest
              .fn()
              .mockImplementation((transaction) =>
                Promise.resolve({ ...transaction, id: 'tx-123' }),
              ),
            findOne: jest.fn().mockImplementation((options) =>
              Promise.resolve({
                id: 'tx-123',
                countryTransaction: 'Argentina',
                message: 'Test',
                createdAt: new Date().toISOString(),
                senderAccount: {
                  firstName: 'Pedro',
                  lastName: 'Gomez',
                  paymentMethod: { platformId: 'virtual_bank' },
                },
                receiverAccount: {
                  firstName: 'Juan',
                  lastName: 'Pérez',
                  paymentMethod: { bankName: 'Banco Galicia' },
                },
                amount: {
                  id: 'amount-123',
                  amountSent: 5000,
                  amountReceived: 5000,
                  currencySent: 'ARS',
                  currencyReceived: 'ARS',
                },
                proofOfPayment: {
                  id: 'proof-123',
                  type: 'image',
                  url: 'https://example.com/proof.jpg',
                },
              }),
            ),
          },
        },
        { provide: getRepositoryToken(AdministracionStatusLog), useValue: {} },
        {
          provide: FinancialAccountsService,
          useValue: {
            create: jest.fn().mockResolvedValue({
              id: 'account-123',
              firstName: 'Mock',
              lastName: 'User',
            }),
          },
        },
        {
          provide: AmountsService,
          useValue: {
            create: jest.fn().mockResolvedValue({
              id: 'amount-123',
              amountSent: 5000,
              amountReceived: 5000,
              currencySent: 'ARS',
              currencyReceived: 'ARS',
            }),
          },
        },
        {
          provide: ProofOfPaymentsService,
          useValue: {
            create: jest.fn().mockResolvedValue({
              id: 'proof-123',
              type: 'image',
              url: 'https://example.com/proof.jpg',
            }),
          },
        },
        { provide: MailerService, useValue: {} },
        { provide: JwtService, useValue: { sign: jest.fn() } },
      ],
    }).compile();

    controller = module.get<TransactionsController>(TransactionsController);
  });

  // Simula un archivo subido
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

  it('crea transacción con método de pago virtual-bank', async () => {
    const dto = {
      id: 'tx-123',
      countryTransaction: 'Argentina',
      message: 'Test',
      createdBy: 'dev@correo.com',
      amount: {
        amountSent: 5000,
        currencySent: 'ARS',
        amountReceived: 5000,
        currencyReceived: 'ARS',
      },
      proofOfPayment: {
        type: 'image',
        url: 'https://example.com/proof.jpg',
      },
      createdAt: new Date().toISOString(),
      finalStatus: 'pending',
      financialAccounts: {
        senderAccount: {
          firstName: 'Pedro',
          lastName: 'Gomez',
          paymentMethod: {
            platformId: 'virtual_bank',
            method: 'virtual-bank',
            virtualBank: {
              currency: 'ARS',
              emailAccount: 'pedro@gmail.com',
              transferCode: 'ABC123',
            },
          },
        },
        receiverAccount: {
          firstName: 'Juan',
          lastName: 'Pérez',
          phoneNumber: '1234567890',
          email: 'juan@example.com',
          paymentMethod: {
            platformId: 'bank',
            method: 'bank',
            bank: {
              currency: 'ARS',
              bankName: 'Banco Galicia',
              sendMethodKey: 'CBU',
              sendMethodValue: '0011223344556677889900',
              documentType: 'DNI',
              documentValue: '11223344',
            },
          },
        },
      },
    };

    const expectedDto = plainToInstance(CreateTransactionDto, dto);
    const file = createMockFile();

    const result = await controller.create(
      { createTransactionDto: JSON.stringify(dto) },
      file,
    );

    // Verifica los campos más importantes
    expect(result.senderAccount.firstName).toBe('Pedro');
    expect(result.senderAccount.paymentMethod.platformId).toBe('virtual_bank');
    expect(result.receiverAccount.paymentMethod.bankName).toBe('Banco Galicia');
  });
});
