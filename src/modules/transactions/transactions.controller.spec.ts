// transactions.controller.int-spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { plainToInstance } from 'class-transformer';

import { Readable } from 'stream';

describe('TransactionsController (integración real)', () => {
  let controller: TransactionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactionsController],
      providers: [TransactionsService], // ¡sin mocks!
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

    // Podés verificar los campos más importantes
    expect(result).toHaveProperty('id');
    expect(result.financialAccounts.senderAccount.firstName).toBe('Pedro');
    expect(
      result.financialAccounts.senderAccount.paymentMethod.virtualBank
        ?.emailAccount,
    ).toBe('pedro@gmail.com');
    expect(
      result.financialAccounts.receiverAccount.paymentMethod.bank?.bankName,
    ).toBe('Banco Galicia');
  });
});
