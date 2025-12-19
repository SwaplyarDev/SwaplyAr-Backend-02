import { Test, TestingModule } from '@nestjs/testing';
import { TransactionsService } from './transactions.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Transaction } from './entities/transaction.entity';
import { FinancialAccountsService } from 'src/deprecated/financial-accounts/financial-accounts.service';
import { AmountsService } from './amounts/amounts.service';
import { ProofOfPaymentsService } from 'src/modules/payments/proof-of-payments/proof-of-payments.service';
import { MailerService } from '@mailer/mailer.service';
import { AdministracionStatusLog } from '@admin/entities/administracion-status-log.entity';
import { ProofOfPayment } from 'src/modules/payments/proof-of-payments/entities/proof-of-payment.entity';

describe('TransactionsService', () => {
  let service: TransactionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionsService,
        {
          provide: getRepositoryToken(Transaction),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(ProofOfPayment),
          useValue: {
            save: jest.fn(),
          },
        },
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
        { provide: FinancialAccountsService, useValue: { create: jest.fn() } },
        { provide: AmountsService, useValue: { create: jest.fn() } },
        { provide: ProofOfPaymentsService, useValue: { create: jest.fn() } },
        { provide: MailerService, useValue: { sendReviewPaymentEmail: jest.fn() } },
      ],
    }).compile();

    service = module.get<TransactionsService>(TransactionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
