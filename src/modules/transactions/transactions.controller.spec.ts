// transactions.controller.int-spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';
import { Transaction } from './entities/transaction.entity';
import { Readable } from 'stream';
import { AdministracionStatusLog } from '@admin/entities/administracion-status-log.entity';
import { FinancialAccountsService } from '@financial-accounts/financial-accounts.service';
import { AmountsService } from './amounts/amounts.service';
import { ProofOfPaymentsService } from '@financial-accounts/proof-of-payments/proof-of-payments.service';
import { MailerService } from '@mailer/mailer.service';
import { JwtService } from '@nestjs/jwt';
import { ProofOfPayment } from '@financial-accounts/proof-of-payments/entities/proof-of-payment.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('TransactionsController (integración real)', () => {
  let controller: TransactionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactionsController],
      providers: [
        TransactionsService,
        {
          provide: getRepositoryToken(AdministracionStatusLog),
          useValue: {
            createQueryBuilder: jest.fn().mockReturnValue({
              leftJoin: jest.fn().mockReturnThis(),
              where: jest.fn().mockReturnThis(),
              orderBy: jest.fn().mockReturnThis(),
              getMany: jest.fn().mockResolvedValue([]),
            }),
          },
        },
        {
          provide: getRepositoryToken(ProofOfPayment),
          useValue: {
            save: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Transaction),
          useValue: {
            create: jest.fn().mockImplementation((obj: unknown) => obj),
            save: jest
              .fn()
              .mockImplementation((transaction: unknown) =>
                Promise.resolve({ ...(transaction as object), id: 'tx-123' }),
              ),
            findOne: jest.fn().mockResolvedValue({
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
              proofsOfPayment: [
                {
                  id: 'proof-123',
                  imgUrl: 'https://example.com/proof.jpg',
                  createAt: new Date().toISOString(),
                },
              ],
            }),
          },
        },
        { provide: getRepositoryToken(AdministracionStatusLog), useValue: {} },
        {
          provide: FinancialAccountsService,
          useValue: {
            create: jest.fn().mockResolvedValue({
              sender: {
                id: 'sender-123',
                firstName: 'Pedro',
                lastName: 'Gomez',
                createdBy: 'dev@correo.com',
                phoneNumber: '12456789',
                paymentMethod: { id: 'pm-s-1', platformId: 'virtual_bank', method: 'virtual-bank' },
              },
              receiver: {
                id: 'receiver-123',
                firstName: 'Juan',
                lastName: 'Pérez',
                paymentMethod: { id: 'pm-r-1', bankName: 'Banco Galicia', method: 'bank' },
              },
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
              imgUrl: 'https://example.com/proof.jpg',
              createAt: new Date(),
            }),
          },
        },
        { provide: MailerService, useValue: { sendReviewPaymentEmail: jest.fn() } },
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
      // paymentsId: 'tx-123', // eliminado
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

  const file = createMockFile();

    const result = await controller.create({ createTransactionDto: JSON.stringify(dto) }, file);

    expect(result.senderAccount.firstName).toBe('Pedro');
    expect(result.senderAccount.paymentMethod.platformId).toBe('virtual_bank');
    expect(result.receiverAccount.paymentMethod.bankName).toBe('Banco Galicia');
    expect(result).not.toHaveProperty('paymentsId'); // opcional
  });
});
